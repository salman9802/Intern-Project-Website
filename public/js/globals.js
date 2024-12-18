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
        location.href = `/products?s=${escapeHtml(search)}`;
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

// CART MENU
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

const cartQuantityInputs = document.querySelectorAll(".cart-quantity-input");
const cartRemoveBtns = document.querySelectorAll(".cart-remove-btn");
const cartQuantityDecrementBtns = document.querySelectorAll(".cart-quantity-decrement-btn");
const cartQuantityIncrementBtns = document.querySelectorAll(".cart-quantity-increment-btn");


function cartModified({productEle, toRemove, quantityEle}) {
    const slug = productEle.querySelector(".product-slug").value;
    if(toRemove) { // remove product
        fetch(`/user/cart/modify/${slug}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ toRemove: true })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                productEle.remove();
                location.reload();
            });
    } else { // quantity change
        if(quantityEle.value > 0 && quantityEle.value < 11) {
            fetch(`/user/cart/modify/${slug}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ quantity: quantityEle.value })
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                    // location.reload();
                });
        } else quantityEle.value = 1;
    }
}

// quantity input change
/* cartQuantityInputs.forEach(cartQuantityInput => {
    cartQuantityInput.addEventListener("change", e => {
        const input = e.target;
        if(input.value > 0 && input.value < 11) {
            const slug = input.parentElement.parentElement.parentElement.querySelector(".product-slug").value;
            console.log(input.value);
            fetch(`/user/cart/modify/${slug}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ quantity: input.value })
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                    location.reload();
                });
        } else input.value = 1;
    });
}); */

// cart remove btn
cartRemoveBtns.forEach(cartRemoveBtn => {
    cartRemoveBtn.addEventListener("click", e => {
        const productEle = e.target.parentElement.parentElement.parentElement;
        cartModified({
            productEle,
            toRemove: true
        });
    /* const input = e.target;
        const slug = input.parentElement.querySelector(".product-slug").value;
        fetch(`/user/cart/modify/${slug}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ toRemove: true })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                input.parentElement.parentElement.parentElement.remove();
                location.reload();
            }); */
    });
});

// increment/decrement btns
cartQuantityIncrementBtns.forEach(cartQuantityIncrementBtn => {
    cartQuantityIncrementBtn.addEventListener("click", e => {
        const productEle = e.target.parentElement.parentElement.parentElement.parentElement;
        const quantityEle = productEle.querySelector(".cart-quantity-input");
        quantityEle.value = parseInt(quantityEle.value) + 1;
        cartModified({
            productEle,
            quantityEle
        });
    });
});
cartQuantityDecrementBtns.forEach(cartQuantityDecrementBtn => {
    cartQuantityDecrementBtn.addEventListener("click", e => {
        const productEle = e.target.parentElement.parentElement.parentElement.parentElement;
        const quantityEle = productEle.querySelector(".cart-quantity-input");
        quantityEle.value = parseInt(quantityEle.value) - 1;
        cartModified({
            productEle,
            quantityEle
        });
    });
});

// Helper functions
// function to create an html node from string
export const strToHtmlNode = str => {
    const placeholder = document.createElement("div");
    placeholder.innerHTML = str;
    return placeholder.firstElementChild;
}