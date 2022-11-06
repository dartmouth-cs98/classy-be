"""
    scrapemedians.py - code that scrapes the ORC medians pages for Classy, a CS 98 project
    Author: Henry Kim
    Term: Fall 2022
"""

import requests
import json
import re
from bs4 import BeautifulSoup

ROOT_URL = "https://www.dartmouth.edu/reg/transcript/medians"
terms = ["20x", "20f", "21w", "21s", "21x", "21f", "22w", "22s"]
median_conversions = {
    'A': 12,
    'A/A-': 11.5,
    'A-': 11,
    'A-/B+': 10.5,
    'B+': 10,
    'B+/B': 9.5,
    'B': 9,
    'B/B-': 8.5,
    'B-': 8
}

courses = { }

for term in terms:
    page = requests.get(f"{ROOT_URL}/{term}.html")
    print(f"{ROOT_URL}/{term}.html")
    soup = BeautifulSoup(page.content, "html.parser")
    medians = soup.find("table").find("tbody").find_all("tr")
    for median in medians:
        cells = median.find_all("td")
        course = cells[1].get_text()
        course = course.split("-")
        course = f"{course[0]} {course[1].lstrip('0')}"
        enrl = int(cells[2].get_text())
        median = cells[3].get_text()
        if course not in courses:
            courses[course] = {}
        if term not in courses[course]:
            courses[course][term] = []
        courses[course][term].append(median)

def average_medians(medians):
    total = 0
    for median in medians:
        total += median_conversions[median]
    return total / len(medians)

for course, data in courses.items():
    for term, medians in data.items():
        term_avg = average_medians(medians)
        courses[course][term] = term_avg

for course, data in courses.items():
    total = 0
    for term, avg in data.items():
        total += avg
    courses[course]["avg"] = total / len(data.items())

for course, data in courses.items():
    print(course, data)