const openHamburgerBtn = document.getElementById("open-hamburger-btn");
const closeHamburgerBtn = document.getElementById("close-hamburger-btn");
const hamburgerMenu = document.getElementById("hamburger-menu");

openHamburgerBtn.addEventListener("click", e => {
    hamburgerMenu.classList.add("hamburger--open");
    document.getElementById("hamburger-overlay").classList.remove("hidden");
});

closeHamburgerBtn.addEventListener("click", e => {
    hamburgerMenu.classList.remove("hamburger--open");
    document.getElementById("hamburger-overlay").classList.add("hidden");
});