from flask import Flask, request, jsonify, make_response, session
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_refresh_token, set_refresh_cookies, get_jwt_identity, jwt_required, JWTManager
from datetime import datetime, timedelta
import sys
import utils
from crawl import create_prices_df
from crawl import YahooCrawler
import figure
import NewsGetter as ng
import re
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

app.secret_key = os.environ.get("APP_SECRET_KEY")

app.config["MONGO_URI"] = os.environ.get("MONGODB_URL")
mongodb_client = PyMongo(app)
db = mongodb_client.db

jwt = JWTManager()
app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY")

app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["JWT_REFRESH_COOKIE_NAME"] = "user_signed_in"
jwt.init_app(app)

@app.route("/api/usstocks")
def usstocks():
    return "US stocks feature will be available soon!"

@app.route("/api/<stock_symbol>/chart")
def render_chart(stock_symbol):
    start = request.args.get("start")
    end = request.args.get("end")
    interval = request.args.get("interval")

    df = create_prices_df(stock_symbol, utils.convert_to_unix_time(start) - 86400, utils.convert_to_unix_time(end) + 50400,
                                interval)
    resp = make_response({
        "candleFig": figure.graph_candlestick(df, stock_symbol + ".TW", interval),
        "volFig": figure.graph_volume(df, interval)
    })
    resp.mimetype = "application/json"
    return resp

@app.route("/api/<stock_symbol>")
def search(stock_symbol):
    regx = re.compile(f"^{stock_symbol}", re.IGNORECASE)
    res = list(db.listed_stocks.find({"symbol": regx}))
    res_array = []
    for i in range(len(res)):
        res_array.append({"chinese_name": res[i]["chinese_name"], "symbol": res[i]["symbol"]})
    return make_response({"result": res_array[:10]})

@app.route("/api/<stock_symbol>/overview")
def overview(stock_symbol):
    db_result = db.listed_stocks.find_one({"symbol": stock_symbol})
    ch_name = db_result["chinese_name"]
    crawler = YahooCrawler(stock_symbol)
    eng_name = db_result["english_name"]
    realtime_price = crawler.realtime_price()
    previous_close = crawler.prev_close()
    open = crawler.open()
    dollar_change = crawler.dollar_change()
    percent_change = crawler.percent_change()
    days_range = crawler.days_range()
    pe_ratio = crawler.pe_ratio()
    dividend_yield = crawler.div_yield()
    beta = crawler.beta()
    return make_response(jsonify({
        "chinese_name": ch_name,
        "english_name": eng_name,
        "realtime": realtime_price,
        "prev_close": previous_close,
        "open": open,
        "dollar_change": dollar_change,
        "percent_change": percent_change,
        "days_range": days_range,
        "pe_ratio": pe_ratio,
        "dividend_yield": dividend_yield,
        "beta": beta
    }))


@app.route("/api/watchlist/user")
@jwt_required(refresh=True)
def user_watchlist():
    current_user_email = get_jwt_identity()
    watchlist_stock_data_list = []
    try:
        watchlist = db.users.find_one({"email": current_user_email})["watchlist"]
        for stock in watchlist:
            # get current price, dollar change and percent change
            crawler = YahooCrawler(stock)
            db_result = db.listed_stocks.find_one({"symbol": stock})
            ch_name = db_result["chinese_name"]
            eng_name = db_result["english_name"]
            realtime_price = crawler.realtime_price()
            dollar_change = crawler.dollar_change()
            percent_change = crawler.percent_change()
            stock_realtime_data = dict(symbol=stock, ch_name=ch_name, eng_name=eng_name, realtime_price=realtime_price,
                                          dollar_change=dollar_change, percent_change=percent_change)
            watchlist_stock_data_list.append(stock_realtime_data)
    except KeyError:
        watchlist_stock_data_list = []
    resp = make_response({"watchlist_data": watchlist_stock_data_list})
    resp.mimetype = "application/json"
    return resp

@app.route("/api/<stock_symbol>/news")
def news(stock_symbol):
    start = request.args.get("begin")
    end = request.args.get("end")
    news_getter = ng.NewsGetter(db.listed_stocks.find_one({"symbol": stock_symbol})["chinese_name"],
                                start, end)

    resp = make_response(jsonify(news=news_getter.get_news_page(int(request.args.get("start")), 15)))
    resp.mimetype = 'application/json'
    return resp, 200


@app.route("/api/emails", methods=["POST"])
def new_contact():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    message = data["message"]
    now = datetime.now()
    db.emails.insert({
        "name": name,
        "email": email,
        "message": message,
        "timestamp": now
    })
    return "Email request saved.", 200

@app.route("/api/user/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    now = datetime.now()

    if db.users.find_one({"email": email}):
        return "Email already registered", 400

    else:
        # hash password
        hashed_password = generate_password_hash(password)
        db.users.insert({
            "email": email,
            "password": hashed_password,
            "created_at": now
        })
        return "User registered.", 200

@app.route("/api/user/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]
    user = db.users.find_one({"email": email})
    if user:
        hashed_password = user["password"]
        if check_password_hash(hashed_password, password):
            refresh_token = create_refresh_token(identity=email)
            print("token is ", refresh_token)
            resp = jsonify({"login": True})
            resp.set_cookie("user_signed_in", refresh_token)
            session['logged_in'] = True
            set_refresh_cookies(resp, refresh_token)
            return resp, 200
    return "Login failed.", 400

@app.route("/api/auth-query")
def auth_query():
    return make_response(jsonify({'logged-in': session.get("logged_in", False)}))

@app.route("/api/logout", methods=["POST"])
def logout():
    session['logged_in'] = False
    resp = make_response("Logged out.")
    resp.set_cookie("user_signed_in", "")
    return resp

@app.route("/api/<stock_symbol>/add")
@jwt_required(refresh=True)
def add(stock_symbol):
    current_user_email = get_jwt_identity()
    query = {"email": current_user_email}
    update = {"$addToSet": {"watchlist": stock_symbol}}
    db.users.update_one(query, update)
    return f"Added {stock_symbol} to watchlist.", 200

@app.route("/api/<stock_symbol>/list")
@jwt_required(refresh=True)
def look_list(stock_symbol):
    current_user_email = get_jwt_identity()
    query = {"email": current_user_email, "watchlist": stock_symbol}
    if len(list(db.users.find(query))) > 0:
        return make_response(jsonify({"inWatchlist": True}))
    else: 
        return make_response(jsonify({"inWatchlist": False}))

@app.route("/api/<stock_symbol>/remove")
@jwt_required(refresh=True)
def remove_from_watchlist(stock_symbol):
    current_user_email = get_jwt_identity()
    query = {"email": current_user_email}
    update = {"$pull": {"watchlist": stock_symbol}}
    db.users.update_one(query, update)
    return f"Removed {stock_symbol} from watchlist.", 200


if __name__ == '__main__':

    if len(sys.argv) >= 2:
        if sys.argv[1] == "do-update":
            utils.update_listed_stock(utils.get_listed_stock_list(), db.listed_stocks)
        else:
            pass

    app.run(debug=False, host='127.0.0.1', port=int(os.environ.get("PORT", 5000)))