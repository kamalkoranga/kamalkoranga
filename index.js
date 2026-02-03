// THEME MAPPING - Each dark theme has its light counterpart
const themeMap = {
  'theme-default-dark': 'theme-default-light',
  'theme-neon-cyber': 'theme-neon-cyber-light',
  'theme-dark-ocean': 'theme-ocean-light',
  'theme-midnight-purple': 'theme-purple-light',
  'theme-terminal-green': 'theme-terminal-green-light',
  'theme-blood-moon': 'theme-rose-light',
  'theme-dark-forest': 'theme-forest-light',
  'theme-obsidian': 'theme-silver-light',
  'theme-deep-space': 'theme-sky-light',
  'theme-noir-red': 'theme-coral-light',
  'theme-carbon-gold': 'theme-amber-light'
};

// All dark themes
const darkThemes = Object.keys(themeMap);

// All light themes
const lightThemes = Object.values(themeMap);

function initializeTheme() {
  const lastTheme = localStorage.getItem('currentTheme');
  const isDarkMode = localStorage.getItem('isDarkMode');

  let newTheme;
  do {
    if (isDarkMode == 'false') {
      // Select a random light theme
      newTheme = lightThemes[Math.floor(Math.random() * lightThemes.length)];
    } else {
      // Select a random dark theme
      newTheme = darkThemes[Math.floor(Math.random() * darkThemes.length)];
    }
  } while (newTheme === lastTheme);

  // Apply the theme
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('currentTheme', newTheme);
  localStorage.setItem('isDarkMode', isDarkMode);
  
  // Update toggle button icon
  updateToggleIcon(isDarkMode);
  
  // Show theme notification
  showThemeNotification(newTheme);
}

function updateToggleIcon(isDark) {
  const toggleButton = document.querySelector('#dark-mode-toogle');
  if (toggleButton) {
    toggleButton.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
}

function showThemeNotification(themeName) {
  const notification = document.createElement('div');
  notification.className = 'theme-notification';
  
  // Clean up theme name for display
  const displayName = themeName
    .replace('theme-', '')
    .replace(/-light$/, ' (light)')
    .replace(/-/g, ' ');
  
  notification.innerHTML = `
    <i class="fa-solid fa-palette"></i>
    <span>${displayName}</span>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 1000);
}

function toggleMobileMenu() {
  document.getElementById("menu").classList.toggle("active");
  document.getElementsByClassName("cta")[0].classList.toggle("active");
}

// Dark Mode Toggle Functionality
const darkModeToogle = document.querySelector('#dark-mode-toogle');

darkModeToogle.addEventListener('click', (e) => {
  const currentTheme = localStorage.getItem('currentTheme');
  const isDarkMode = localStorage.getItem('isDarkMode') !== 'false';
  
  let newTheme;
  
  if (isDarkMode) {
    // Switch to light mode - find the light counterpart
    if (darkThemes.includes(currentTheme)) {
      newTheme = themeMap[currentTheme];
    } else {
      // Fallback to default light if somehow in light mode already
      newTheme = 'theme-default-light';
    }
  } else {
    // Switch to dark mode - find the dark counterpart
    const darkThemeEntry = Object.entries(themeMap).find(([dark, light]) => light === currentTheme);
    if (darkThemeEntry) {
      newTheme = darkThemeEntry[0];
    } else {
      // Fallback to default dark
      newTheme = 'theme-default-dark';
    }
  }
  
  // Apply new theme
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('currentTheme', newTheme);
  localStorage.setItem('isDarkMode', !isDarkMode);
  
  // Update toggle button icon
  updateToggleIcon(!isDarkMode);
  
  // Show notification
  showThemeNotification(newTheme);
});

// Initialize theme on page load
initializeTheme();

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
