// Banner Animation
const bannerImgs = document.querySelectorAll(".banner-img");
const bannerInterval = setInterval(changeBanner, 4000);
let i = 0;

bannerImgs[i].classList.add("banner-selected");
function changeBanner() {
    bannerImgs[i].classList.remove("banner-selected");
    i = (++i) % bannerImgs.length;
    bannerImgs[i].classList.add("banner-selected");
}

// Featured Products
const productContainer = document.querySelector(".products");
const productCard = document.querySelector(".product-card");

let pos = { top: 0, left: 0, x: 0, y: 0 };

const mouseDownHandler = (e) => {
    e.preventDefault(); // to get mouseup event
    productContainer.addEventListener('mousemove', mouseMoveHandler); // add listeners again
    // productContainer.addEventListener('mouseup', mouseUpHandler);

    // Get original position of mouse and scrollbar
    pos = {
        // The current scroll
        left: productContainer.scrollLeft,
        top: productContainer.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    // Change the cursor and prevent user from selecting the text
    productContainer.style.cursor = 'grabbing';
    productContainer.style.userSelect = 'none';
}

productContainer.addEventListener("mousedown", mouseDownHandler);

// `pos` stores the current scroll and mouse positions. When user moves the mouse, we calculate how far it has been moved, and then scroll to the element to the same position:
const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    
    // Scroll the element
    productContainer.scrollTop = pos.top - dy;
    productContainer.scrollLeft = pos.left - dx;
};

productContainer.addEventListener("mousemove", mouseMoveHandler);


// The CSS properties are reset when the mouse is released:
const mouseUpHandler = function () {
    // Remove listeners
    productContainer.removeEventListener('mousemove', mouseMoveHandler);
    // productContainer.removeEventListener('mouseup', mouseUpHandler);

    productContainer.style.cursor = 'grab';
    productContainer.style.removeProperty('user-select');
};

productContainer.addEventListener("mouseup", mouseUpHandler);


// const mouseOutHandler = function () {
//     console.log("mouse out");
//     // Remove listeners
//     productContainer.removeEventListener('mousemove', mouseMoveHandler);

//     productContainer.style.cursor = 'grab';
//     productContainer.style.removeProperty('user-select');
// }

// productContainer.addEventListener("mouseout", mouseOutHandler);