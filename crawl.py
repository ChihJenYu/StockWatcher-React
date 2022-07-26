import pandas as pd
import csv
import requests
from bs4 import BeautifulSoup
from utils import remove_comma

def create_prices_df(ticker, start_unix, end_unix, interval):
    if interval == "Daily": key = "d"
    elif interval == "Weekly": key = "wk"
    else: key = "mo"
    site = f"https://query1.finance.yahoo.com/v7/finance/download/{ticker}.TW?period1={start_unix}&period2={end_unix}&interval=1{key}&events=history&includeAdjustedClose=true"
    response = requests.get(site, headers={"User-Agent": "Chrome/63.0.3239.132"})
    result = list(csv.reader(response.text.splitlines(), delimiter=","))[1:]

    prices_df = pd.DataFrame({
        "Date": [i[0] for i in result],
        "Open": [i[1] for i in result],
        "High": [i[2] for i in result],
        "Low": [i[3] for i in result],
        "Close": [i[4] for i in result],
        "Volume": [float(i[6]) if i[6] != "null" else 0 for i in result]
    })

    prices_df["Open"] = pd.to_numeric(prices_df["Open"], errors="coerce")
    prices_df["Close"] = pd.to_numeric(prices_df["Close"], errors="coerce")

    prices_df["MA5"] = prices_df["Close"].rolling(5).mean()
    prices_df["MA10"] = prices_df["Close"].rolling(10).mean()
    prices_df["MA20"] = prices_df["Close"].rolling(20).mean()
    prices_df["MA30"] = prices_df["Close"].rolling(30).mean()
    prices_df["MA60"] = prices_df["Close"].rolling(60).mean()

    return prices_df

class YahooCrawler:
    def __init__(self, stock_symbol):
        self.STOCK_SYMBOL = stock_symbol
        self.SUMMARY_URL = f"https://finance.yahoo.com/quote/{stock_symbol}.TW?p={stock_symbol}.TW"
        self.RESPONSE_TEXT = requests.get(self.SUMMARY_URL, headers={"User-Agent": "Chrome/63.0.3239.132"}).text
        self.SOUP = BeautifulSoup(self.RESPONSE_TEXT, "html.parser")
    def realtime_price(self):
        try:
            return remove_comma(self.SOUP.select('#quote-header-info fin-streamer[data-test="qsp-price"]')[0].get_text())
        except Exception as e:
            print(e)
            return "N/A"

    def prev_close(self):
        try:
            return remove_comma(self.SOUP.select('#quote-summary>div[data-test="left-summary-table"] td[data-test="PREV_CLOSE-value"]')[0].get_text())
        except IndexError:
            return "N/A"
    def div_yield(self):
        try:
            return remove_comma(self.SOUP.select('#quote-summary>div[data-test="right-summary-table"] td[data-test="DIVIDEND_AND_YIELD-value"]')[0].get_text())
        except IndexError:
            return "N/A"
    def pe_ratio(self):
        try:
            return remove_comma(self.SOUP.select('#quote-summary>div[data-test="right-summary-table"] td[data-test="PE_RATIO-value"]')[0].get_text())
        except IndexError:
            return "N/A"
    def beta(self):
        try:
            return remove_comma(self.SOUP.select('#quote-summary>div[data-test="right-summary-table"] td[data-test="BETA_5Y-value"]')[0].get_text())
        except IndexError:
            return "N/A"
    def open(self):
        try:
            return remove_comma(self.SOUP.select('#quote-summary>div[data-test="left-summary-table"] td[data-test="OPEN-value"]')[0].get_text())
        except IndexError:
            return "N/A"
    def low(self):
        try:
            return remove_comma(self.SOUP.select('#quote-summary>div[data-test="left-summary-table"] td[data-test="DAYS_RANGE-value"]')[0].get_text().split(" - ")[0])
        except IndexError:
            return "N/A"
    def high(self):
        try:
            return remove_comma(self.SOUP.select('#quote-summary>div[data-test="left-summary-table"] td[data-test="DAYS_RANGE-value"]')[0].get_text().split(" - ")[1])
        except IndexError:
            return "N/A"
    def percentage(self):
        low = self.low()
        high = self.high()
        if low == "N/A" or high == "N/A":
            return "N/A"
        else:
            percentage = "{:.2%}".format(1.0 - float(low) / float(high))
            return percentage
    def days_range(self):
        low = self.low()
        high = self.high()
        percentage = self.percentage()
        if low == "N/A" or high == "N/A":
            return "N/A"
        else:
            return str(low) + "-" + str(high) + " (" + str(percentage) + ")"
    def dollar_change(self):
        prev_close = self.prev_close()
        current = self.realtime_price()
        if prev_close == "N/A" or current == "N/A":
            return "N/A"
        else:
            prev_close = float(prev_close)
            current = float(current)
            if current >= prev_close:
                return "+" + str(round(current - prev_close, 2))
            else:
                return "-" + str(round(prev_close - current, 2))
    def percent_change(self):
        prev_close = self.prev_close()
        current = self.realtime_price()
        if prev_close == "N/A" or current == "N/A":
            return "N/A"
        else:
            prev_close = float(prev_close)
            current = float(current)
            if current >= prev_close:
                return "+" + str("{:.2%}".format((current - prev_close) / prev_close))
            else:
                return "-" + str("{:.2%}".format((prev_close - current) / prev_close))