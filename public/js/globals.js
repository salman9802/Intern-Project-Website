const notificationAlerts = document.querySelectorAll(".notification-alert");
notificationAlerts?.forEach(notificationAlert => {
    setTimeout(() => {
        notificationAlert.remove();
    }, 2500);
});

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
        location.href = `/products?q=${escapeHtml(e.target.value).toLowerCase()}`;
    }
    const search = escapeHtml(e.target.value);
    console.log(search);
    // Make a get request for products with search
});

document.getElementById("header-search-cancel").addEventListener("click", e => {
    headerSearch.classList.remove("flex");
    headerSearch.classList.add("hidden");
});