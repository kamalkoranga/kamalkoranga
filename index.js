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

// Initialize theme on page load
function initializeTheme() {
  const lastTheme = localStorage.getItem('currentTheme');
  const isDarkMode = localStorage.getItem('isDarkMode');

  let newTheme;
  do {
    if (isDarkMode === 'false') {
      // Select a random light theme
      newTheme = lightThemes[Math.floor(Math.random() * lightThemes.length)];
    } else {
      // Select a random dark theme
      newTheme = darkThemes[Math.floor(Math.random() * darkThemes.length)];
    }
  } while (newTheme === lastTheme && (isDarkMode === 'false' ? lightThemes.length : darkThemes.length) > 1);

  // Apply the theme
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('currentTheme', newTheme);
  localStorage.setItem('isDarkMode', isDarkMode);
  
  // Update toggle button icon
  updateToggleIcon(isDarkMode);
  
  // Show theme notification
  showThemeNotification(newTheme);
}

// Update dark mode toggle icon
function updateToggleIcon(isDark) {
  const toggleButton = document.querySelector('#dark-mode-toggle');
  if (toggleButton) {
    toggleButton.innerHTML = `<i class="fa-solid fa-${isDark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
    toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

// Show theme change notification
function showThemeNotification(themeName) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.theme-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'theme-notification';
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');
  
  // Clean up theme name for display
  const displayName = themeName
    .replace('theme-', '')
    .replace(/-light$/, ' (light)')
    .replace(/-/g, ' ');
  
  notification.innerHTML = `
    <i class="fa-solid fa-palette" aria-hidden="true"></i>
    <span>${displayName}</span>
  `;
  document.body.appendChild(notification);
  
  // Trigger animation
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 1200);
}

// Toggle mobile menu
function toggleMobileMenu() {
  const menu = document.getElementById("menu");
  const cta = document.querySelector(".cta");
  const toggle = document.querySelector(".mobile-toggle");
  
  if (menu) {
    const isActive = menu.classList.toggle("active");
    toggle?.setAttribute('aria-expanded', isActive.toString());
  }
  
  cta?.classList.toggle("active");
}

// Dark Mode Toggle Event Handler
function setupDarkModeToggle() {
  const darkModeToggle = document.querySelector('#dark-mode-toggle');
  
  if (!darkModeToggle) return;

  darkModeToggle.addEventListener('click', (e) => {
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
    localStorage.setItem('isDarkMode', (!isDarkMode).toString());
    
    // Update toggle button icon
    updateToggleIcon(!isDarkMode);
    
    // Show notification
    showThemeNotification(newTheme);
  });
}

// Set current year in footer
function setCurrentYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Prevent right-click and certain keyboard shortcuts (optional - remove if not needed)
function setupSecurityMeasures() {
  // Disable right-click context menu
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  // Disable certain keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
      (e.ctrlKey && (e.key === "U" || e.key === "u" || e.key === "s" || e.key === "S"))
    ) {
      e.preventDefault();
    }
  });
}

// Load blog posts from RSS feed
async function loadBlogPosts() {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  const feedUrl = 'https://misslogs.klka.in/index.xml';

  // Helper functions
  const cleanText = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent.trim();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? 'Recent'
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const estimateReadTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  const createBlogCard = (item) => {
    const title = item.querySelector('title')?.textContent?.trim() || 'Untitled Post';
    const link = item.querySelector('link')?.textContent?.trim() || '#';
    const rawDesc = item.querySelector('description')?.textContent || '';
    const description = cleanText(rawDesc).substring(0, 150) + '...';
    const pubDate = formatDate(item.querySelector('pubDate')?.textContent);
    const readTime = estimateReadTime(description);

    return `
      <a href="${link}" target="_blank" rel="noopener noreferrer" class="blog-card">
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="blog-meta">
          <span class="blog-date">${pubDate}</span>
          <div class="read-time">
            <i class="fa-regular fa-clock" aria-hidden="true"></i>
            <span>${readTime} min read</span>
          </div>
        </div>
      </a>
    `;
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(feedUrl, { 
      signal: controller.signal,
      cache: 'default'
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Failed to parse RSS feed');
    }

    const items = xmlDoc.querySelectorAll('item');

    if (!items.length) {
      blogGrid.innerHTML = '<div class="error">No blog posts found.</div>';
      return;
    }

    const posts = Array.from(items).slice(0, 3);
    blogGrid.innerHTML = posts.map(createBlogCard).join('');

  } catch (err) {
    console.error('Error loading blog posts:', err);
    
    let errorMessage = 'Unable to load blog posts at the moment.';
    if (err.name === 'AbortError') {
      errorMessage = 'Request timeout. Please check your connection.';
    }

    blogGrid.innerHTML = `
      <div class="error">
        <p>${errorMessage}</p>
        <p><a href="https://misslogs.klka.in" target="_blank" rel="noopener noreferrer" class="button">Visit Blog Directly</a></p>
      </div>
    `;
  }
}

/**
 * Smooth scroll to section when clicking nav links
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('nav')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const menu = document.getElementById("menu");
        const cta = document.querySelector(".cta");
        if (menu?.classList.contains('active')) {
          menu.classList.remove('active');
          cta?.classList.remove('active');
        }
      }
    });
  });
}

/**
 * Add intersection observer for fade-in animations
 */
function setupScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

/**
 * Close mobile menu when clicking outside
 */
function setupMobileMenuClose() {
  document.addEventListener('click', (e) => {
    const menu = document.getElementById("menu");
    const toggle = document.querySelector(".mobile-toggle");
    
    if (menu?.classList.contains('active') && 
        !menu.contains(e.target) && 
        !toggle?.contains(e.target)) {
      toggleMobileMenu();
    }
  });
}

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
  // Initialize theme
  initializeTheme();
  
  // Set up event listeners
  setupDarkModeToggle();
  setCurrentYear();
  setupSmoothScroll();
  setupMobileMenuClose();
  
  // Optional security measures (comment out if not needed)
  // setupSecurityMeasures();
  
  // Load blog posts
  loadBlogPosts();
  
  // Set up scroll animations after a short delay
  setTimeout(setupScrollAnimations, 100);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Refresh blog posts when page becomes visible again
    loadBlogPosts();
  }
});

// Optimize for mobile - prevent 300ms tap delay
if ('ontouchstart' in window) {
  document.addEventListener('touchstart', function() {}, { passive: true });
}