import Cookie from "./cookie.js";
import { strToHtmlNode } from "./globals.js";

// Cookie.set("test", "testvalue");
// console.log(Cookie.get("abc"));
// console.log(Cookie.get("test"));


// Add to Cart
const addToCartBtn = document.getElementById("add-to-cart-btn");

addToCartBtn.addEventListener("click", e => {
    const slug = e.target.previousElementSibling.value;
    fetch(`/user/cart/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ slug })
    })
        .then(res => res.json())
        .then(json => {
            const cartAlerts = document.getElementById("cart-alerts");
            
            let div;
            // Create UI element
            if(json.code === 201) {
                div = strToHtmlNode(`<div class="notification-alert w-11/12 mx-auto my-2 px-3 py-2 flex items-center justify-center space-x-1 bg-green-200 text-green-700 rounded-lg md:px-5 md:py-3 md:space-x-3 lg:container">
                    <span class="bg-white px-3 py-1 rounded-full">&check;</span>
                    <span>${json.msg}</span> 
                </div>`);
            } else {
                div = strToHtmlNode(`<div class="notification-alert w-11/12 mx-auto my-2 px-3 py-2 flex items-center justify-center space-x-1 bg-red-200 text-red-700 rounded-lg md:px-5 md:py-3 md:space-x-3 lg:container">
                    <span class="bg-white px-3 py-1 rounded-full">&excl;</span>
                    <span>${json.msg}</span>
                </div>`);
            }

            cartAlerts.prepend(div);
            setTimeout(() => {
                div.remove();
                location.reload();
            }, 2500);
        });
});