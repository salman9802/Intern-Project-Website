// HEADER SEARCH INPUT
// https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
};

const headerSearchBtn = document.getElementById("header-search-btn");
const headerSearch = document.getElementById("header-search");
let headerShown = false;

headerSearchBtn.addEventListener("click", e => {
    if(headerShown) {
        headerSearch.classList.remove("flex");
        headerSearch.classList.add("hidden");
        headerShown = !headerShown;
    } else {
        headerSearch.classList.remove("hidden");
        headerSearch.classList.add("flex");
        headerShown = !headerShown;
    }
});

document.getElementById("header-search-input").addEventListener("keyup", async e => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        const search = e.target.value.toLowerCase();
        e.target.value = "";
        location.href = `/products?q=${escapeHtml(search)}`;
    }
    const search = escapeHtml(e.target.value);
    console.log(search);
    // Make a get request for products with search
});

document.getElementById("header-search-cancel").addEventListener("click", e => {
    headerSearch.classList.remove("flex");
    headerSearch.classList.add("hidden");
});


// HAMBURGER MENU
const openHamburgerBtn = document.getElementById("open-hamburger-btn");
const closeHamburgerBtn = document.getElementById("close-hamburger-btn");
const hamburgerMenu = document.getElementById("hamburger-menu");

openHamburgerBtn.addEventListener("click", e => {
    document.body.style.overflowY = "hidden";
    hamburgerMenu.classList.add("hamburger--open");
    document.getElementById("hamburger-overlay").classList.remove("hidden");
});

closeHamburgerBtn.addEventListener("click", e => {
    hamburgerMenu.classList.remove("hamburger--open");
    document.getElementById("hamburger-overlay").classList.add("hidden");
    document.body.style.overflowY = "auto";
});

// CART
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartMenu = document.getElementById("cart-menu");

openCartBtn.addEventListener("click", e => {
    document.body.style.overflowY = "hidden"; // disable scroll
    cartMenu.classList.add("cart--open"); // open cart
    document.getElementById("cart-overlay").classList.remove("hidden"); // show overlay
});

closeCartBtn.addEventListener("click", e => {
    cartMenu.classList.remove("cart--open"); // close cart
    document.getElementById("cart-overlay").classList.add("hidden"); // hide overlay
    document.body.style.overflowY = "auto"; // enable scroll
});