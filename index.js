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