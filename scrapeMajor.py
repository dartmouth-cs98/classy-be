"""
    scrapeMajor.py - code that scrapes the major/minor requirements for Classy, a CS 98 project
    Author: Alex Feng
    Term: Fall 2022
"""

import requests
import json
import re
from bs4 import BeautifulSoup

ROOT_URL = "https://dartmouth.smartcatalogiq.com/"

# def scrape_dept_page(root_url: str, soup: BeautifulSoup):
def scrape_dept_page():
    # find the courses links
    # courses_links = soup.select("#sc-programlinks > ul > li > p > a")
    # # some departments have multiple programs (e.g., Spanish and Portuguese have Spanish courses and Portuguese courses)
    # for link in courses_links:
    #     # find each course link
    page = requests.get("https://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Computer-Science")
    soup = BeautifulSoup(page.content, "html.parser")
    print(soup)


def scrape_dept_pages(root_url: str, seed: str, func = None):
    # start with the page listing all departments
    page = requests.get(f"{root_url}{seed}")
    soup = BeautifulSoup(page.content, "html.parser")
    departments = soup.select("#sc-programlinks a")
    for department in departments:
        # extract the department page link
        title = department.contents[0]
        link = department['href']
        page = requests.get(f"{root_url}{link}")
        soup = BeautifulSoup(page.content, "html.parser")
        if func is not None:
            func(root_url, soup)

# scrape_dept_pages(ROOT_URL, "current/orc/Departments-Programs-Undergraduate", scrape_dept_page)
scrape_dept_page()