import requests
import xml.etree.ElementTree as ET

RSS_URL = "https://misslogs.klka.in/index.xml"

response = requests.get(RSS_URL, timeout=15)
response.raise_for_status()

root = ET.fromstring(response.content)

posts = []

for item in root.findall("./channel/item")[:5]:
    title = item.findtext("title", "Untitled")
    link = item.findtext("link", "#")
    reading_time = item.findtext("readingTime", "1")

    posts.append(f"- [{title}]({link}) • {reading_time} min read")

blog_posts = "\n".join(posts)

START = "<!-- BLOG-POST-LIST:START -->"
END = "<!-- BLOG-POST-LIST:END -->"

with open("README.md", "r", encoding="utf-8") as f:
    readme = f.read()

start = readme.index(START) + len(START)
end = readme.index(END)

updated = readme[:start] + "\n" + blog_posts + "\n" + readme[end:]

with open("README.md", "w", encoding="utf-8") as f:
    f.write(updated)

print("README updated successfully.")
