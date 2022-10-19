import requests
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
            print(soup.select("h1"))

def scrape_dept_pages(root_url, seed, func=None):
    # start with the page listing all departments
    page = requests.get(f"{root_url}{seed}")
    soup = BeautifulSoup(page.content, "html.parser")
    departments = soup.select("#sc-programlinks a")
    for department in departments:
        # extract the department page link
        title = department.contents[0]
        print(title)
        link = department['href']
        page = requests.get(f"{root_url}{link}")
        soup = BeautifulSoup(page.content, "html.parser")
        if func is not None:
            func(root_url, soup)

        
scrape_dept_pages(ROOT_URL, "current/orc/Departments-Programs-Undergraduate", scrape_dept_pages)
