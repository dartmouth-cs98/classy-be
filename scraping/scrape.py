"""
    scrape.py - code that scrapes the ORC course pages for Classy, a CS 98 project
    Author: Henry Kim
    Term: Fall 2022
"""

import requests
import json
from bs4 import BeautifulSoup

ROOT_URL = "https://dartmouth.smartcatalogiq.com/"

def get_course_name(soup: BeautifulSoup, selector1: str, selector2: str) -> (str, float, str):
    """
    retrieves and returns the course name on the ORC page, which consists of a department, number, and title. 
    Department is returned as a string, number is returned as a float, and title is returned as a string
    """
    course_number = soup.select(selector1)[0].contents[0].split()
    course_dept = course_number[0]
    course_number = float(course_number[1])
    course_title = soup.select(selector2)[0].contents[2].strip()
    course_name = {
        'course_number': course_number,
        'course_dept': course_dept,
        'course_title': course_title,
    }
    return course_name

def get_instructors(soup: BeautifulSoup, selector: str) -> list[str]:
    """retrieves and returns the instructors on the ORC course page as a list of strings"""
    instructors = soup.select(selector)
    if len(instructors) == 0:
        return []
    return  instructors[0].contents[1]

def get_prereqs(soup: BeautifulSoup, selector: str) -> list[str]:
    """retrieves and returns the prereqs on the ORC course page as a list of strings"""
    prereqs = soup.select(selector)
    if len(prereqs) == 0:
        return []
    prereqs = prereqs[0]
    return prereqs

def get_distribs_wc(soup: BeautifulSoup, selector: str) -> (list[str], str):
    """retrieves and returns the distribs and world cultures on the ORC course page as a list of strings (possible distribs) and a string (WC if applicable)"""
    distribs = soup.select(selector)
    wc = None
    # some classes have no distribs or WCs
    if len(distribs) == 0:
        return [], wc
    
    # handle classes with WCs
    distribs = distribs[0].contents[0].split("; ")
    if len(distribs) == 2:
        wc = distribs[1][distribs[1].index(":")+1:]
    
    # handle classes with multiple possible distribs (e.g., INT or LIT)
    distribs = distribs[0][distribs[0].index(":")+1:]
    distribs = distribs.split(" or ")
    return distribs, wc

def get_offered_terms(soup: BeautifulSoup, selector: str) -> list[str]:
    """retrieves and returns the terms that a course is offered on the ORC course page as a list of strings"""
    offered_terms = soup.select(selector)
    for index in range(len(offered_terms)):
        offered_terms[index] = offered_terms[index].contents[0]
    return offered_terms

def scrape_course_page(root_url: str, link: str):
    """
    scrapes a course page and returns a json of the course properties
    """
    page = requests.get(f"{root_url}{link}")
    soup = BeautifulSoup(page.content, "html.parser")
    # on course page
    course_name = get_course_name(soup, "h1 span", "h1")
    paragraphs = soup.select("#main .desc p")

    instructors = get_instructors(soup, "#instructor")
    prereqs = get_prereqs(soup, '.sc_prereqs')
    distribs, wc = get_distribs_wc(soup, ".sc-extrafield p")
    offered_terms = get_offered_terms(soup, '#main .offered li')

    course = {
        'course_name': course_name,
        'instructors': instructors,
        'distribs': distribs,
        'wc': wc,
        'offered': offered_terms,
    }

    course_json = json.dumps(course)
    return course_json

def scrape_course_pages(root_url: str, soup: BeautifulSoup):
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
            course_json = scrape_course_page(root_url, link)
            print(course_json)


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

scrape_dept_pages(ROOT_URL, "current/orc/Departments-Programs-Undergraduate", scrape_course_pages)
