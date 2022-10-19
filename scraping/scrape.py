"""
    scrape.py - code that scrapes the ORC course pages for Classy, a CS 98 project
    Author: Henry Kim
    Term: Fall 2022
"""

import requests
import json
from bs4 import BeautifulSoup

ROOT_URL = "https://dartmouth.smartcatalogiq.com/"

def scrape_course_pages(root_url, soup):
    # find the courses links
    courses_links = soup.select("#sc-programlinks > ul > li > p > a")
    # some departments have multiple programs (e.g., Spanish and Portuguese have Spanish courses and Portuguese courses)
    for link in courses_links:
        # find each course link
        page = requests.get(f"{root_url}{link['href']}")
        soup = BeautifulSoup(page.content, "html.parser")
        courses = soup.select("#main > ul > li > a")
        for course in courses:
            link = course['href']
            page = requests.get(f"{root_url}{link}")
            soup = BeautifulSoup(page.content, "html.parser")
            # on course page
            course_number = soup.select("h1 span")[0].contents[0].split()
            course_dept = course_number[0]
            course_number = course_number[1]
            course_title = soup.select("h1")[0].contents[2].strip()
            paragraphs = soup.select("#main .desc p")

            course_name = {
                'course_number': course_number,
                'course_dept': course_dept,
                'course_title': course_title
            }

            course = {
                'course_name': course_name
            }

            course_json = json.dumps(course)
            print(course_json)


def scrape_dept_pages(root_url, seed, func=None):
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

scrape_dept_pages(ROOT_URL, "current/orc/Departments-Programs-Undergraduate", scrape_course_pages)
