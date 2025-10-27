function toggleMobileMenu() {
  document.getElementById("menu").classList.toggle("active");
  document.getElementsByClassName("cta")[0].classList.toggle("active");
}

let darkMode = localStorage.getItem('darkMode');
const darkModeToogle = document.querySelector('#dark-mode-toogle');

if (darkMode === 'enabled') {
  document.body.classList.add('darkmode');
  darkModeToogle.innerHTML = `<i class="fa-solid fa-sun"></i>`
}

darkModeToogle.addEventListener('click', (e) => {
  darkMode = localStorage.getItem('darkMode');
  if (darkMode !== 'enabled') {
    document.body.classList.add('darkmode');
    darkModeToogle.innerHTML = `<i class="fa-solid fa-sun"></i>`
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('darkmode');
    darkModeToogle.innerHTML = `<i class="fa-solid fa-moon"></i>`
    localStorage.setItem('darkMode', null);
  }
});

// get the current year
const year = new Date().getFullYear();
document.getElementById("year").innerHTML = year;

// Disable right-click context menu
document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey &&
      e.shiftKey &&
      (e.key === "I" || e.key === "J" || e.key === "C")) ||
    (e.ctrlKey && e.key === "U") ||
    (e.ctrlKey && e.key === "u") ||
    (e.ctrlKey && e.key === "s") ||
    (e.ctrlKey && e.key === "S")
  ) {
    e.preventDefault();
  }
});

// Load blog posts
async function loadBlogPosts() {
  const blogGrid = document.getElementById('blogGrid');
  const feedUrl = 'https://misslogs.klka.in/index.xml';

  // Helpers
  const cleanText = (html) => html.replace(/<[^>]*>/g, '').trim();
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? 'Recent'
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const estimateReadTime = (text) => {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    if (!items.length) {
      blogGrid.innerHTML = '<div class="error">No blog posts found.</div>';
      return;
    }

    const posts = Array.from(items).slice(0, 3);

    blogGrid.innerHTML = posts.map(item => {
      const title = item.querySelector('title')?.textContent.trim() || 'Untitled Post';
      const link = item.querySelector('link')?.textContent.trim() || '#';
      const rawDesc = item.querySelector('description')?.textContent || '';
      const description = cleanText(rawDesc).substring(0, 150) + '...';
      const pubDate = formatDate(item.querySelector('pubDate')?.textContent);
      const readTime = estimateReadTime(description);

      return `
        <a href="${link}" target="_blank" class="blog-card">
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="blog-meta">
            <span class="blog-date">${pubDate}</span>
            <div class="read-time">
              <i class="fa-regular fa-clock"></i>
              <span>${readTime} min read</span>
            </div>
          </div>
        </a>
      `;
    }).join('');

  } catch (err) {
    console.error('Error loading blog posts:', err);
    blogGrid.innerHTML = `
      <div class="error">
        <p>Unable to load blog posts at the moment.</p>
        <p><a href="${feedUrl.replace('/index.xml','')}" target="_blank" class="button">Visit Blog Directly</a></p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);
