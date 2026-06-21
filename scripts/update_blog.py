import xml.etree.ElementTree as ET

tree = ET.parse("blog/public/index.xml")
root = tree.getroot()

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
