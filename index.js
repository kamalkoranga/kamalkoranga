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