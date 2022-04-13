import time
import datetime
import requests
from bs4 import BeautifulSoup
import csv

def convert_to_unix_time(time_str):
    return int(time.mktime(datetime.datetime.strptime(time_str, "%Y-%m-%d").timetuple()))

def get_listed_stock_list():
    print("Fetching listed stocks...")
    resp = requests.get("https://tw.stock.yahoo.com/h/kimosel.php?tse=1&cat=%A5b%BE%C9%C5%E9&form=menu&form_id=stock_id&form_name=stock_name&domain=0")
    soup = BeautifulSoup(resp.text, "html.parser")
    option_list = soup.select("td.c3")
    result = []

    for i in range(len(option_list)):
        if not option_list[i].get("rowspan") == "3":
            if option_list[i].a and not (option_list[i].a.getText() in ["市認購", "市認售", "市牛證"]):
                category_resp = requests.get("https://tw.stock.yahoo.com" + option_list[i].a.get("href"))
                category_soup = BeautifulSoup(category_resp.text, "html.parser")
                stock_list = category_soup.select('form[name="stock"] td[width="154"]')
                for j in range(len(stock_list)):
                    if stock_list[j].a:
                        # a string
                        chinese_data = stock_list[j].a.getText()[1:]
                        result.append({
                            "symbol": chinese_data.split(" ")[0],
                            "chinese_name": chinese_data.split(" ")[1]
                        })
    
    result_length = len(result)
    
    for i in range(len(result)):
        stock_symbol = result[i]["symbol"]
        print(f"Fetching English data for stock no.{i + 1} of {result_length}")
        english_resp = requests.get(f"https://finance.yahoo.com/quote/{stock_symbol}.TW?p={stock_symbol}.TW&.tsrc=fin-srch", headers={"User-Agent": "Chrome/63.0.3239.132"})
        english_soup = BeautifulSoup(english_resp.text, "html.parser")
        english_name = "N/A"
        try:
            english_name = english_soup.select("#mrt-node-Lead-4-QuoteHeader h1")[0].get_text().split(" (")[0]
        except IndexError:
            english_name = "N/A"

        result[i]["english_name"] = english_name
    print("Fetching completed.")
    return result

def update_listed_stock(stock_list, collection):
    try:
        print("Updating MongoDB...")
        collection.delete_many({})
        for stock in stock_list:
            collection.insert_one({"symbol": stock["symbol"], "chinese_name": stock["chinese_name"], "english_name": stock["english_name"]})
        return True
    except AttributeError:
        return False

def get_OTC_stock_list():
    resp = requests.get("https://tw.stock.yahoo.com/h/kimosel.php?tse=2&cat=%C2d%A5b%BE%C9&form=menu&form_id=stock_id&form_name=stock_name&domain=0")
    soup = BeautifulSoup(resp.text, "html.parser")
    option_list = soup.select("td.c3")
    result = []

    for i in range(len(option_list)):
        if not option_list[i].get("rowspan") == "4":
            if option_list[i].a:
                category_resp = requests.get("https://tw.stock.yahoo.com" + option_list[i].a.get("href"))
                category_soup = BeautifulSoup(category_resp.text, "html.parser")
                stock_list = category_soup.select('form[name="stock"] td[width="154"]')
                for j in range(len(stock_list)):
                    if stock_list[j].a:
                        result.append(stock_list[j].a.getText()[1:])
    return result

def remove_comma(dollar_text):
    if "," in dollar_text:
        return dollar_text.replace(",", "")
    return dollar_text