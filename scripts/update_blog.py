import requests
import xml.etree.ElementTree as ET

RSS_URL = "https://misslogs.klka.in/index.xml"

headers = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/137.0 Safari/537.36"
    )
}

response = requests.get(
    RSS_URL,
    headers=headers,
    timeout=15,
)

print(response.status_code)
print(response.text[:300])
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
