const banner = document.querySelectorAll(".banner");

const bannerInterval = setInterval(changeBanner, 4000);

let i = 0;

banner[i].classList.add("banner-selected");

function changeBanner() {
    banner[i].classList.remove("banner-selected");
    i = (++i) % banner.length;
    banner[i].classList.add("banner-selected");
}