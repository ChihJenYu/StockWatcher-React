import requests
import lxml
from bs4 import BeautifulSoup

class NewsGetter():
    def __init__(self, q, start_date, end_date, country="TW", lang="zh"):
        self.country = country.upper()
        self.lang = lang.lower()
        self.SEARCH_URL = f'https://news.google.com/rss/search?q=allintitle:"{q}"' \
                          f'+after:{start_date}+before:{end_date}&ceid={country}:{lang}&hl={lang}-{country}&gl={country}'

        self.search_result = requests.get(self.SEARCH_URL).text

    def get_news_page(self, start, per_page):
        soup = BeautifulSoup(self.search_result, "html.parser")
        res = []
        for i in range(per_page):
            title_tag_list = soup.select(f"item:nth-of-type({start + i}) title")
            if len(title_tag_list) == 0:
                return res
            title = str(title_tag_list[0]).split("</title>")[0].split("<title>")[1]
            a_tag = soup.select(f"item:nth-of-type({start + i}) description")[0].get_text()
            link = a_tag.split('"')[1]
            pubDate = soup.select(f"item:nth-of-type({start + i}) pubDate")[0].get_text()
            res.append(dict(title=title, link=link, pubDate=pubDate))
        return res