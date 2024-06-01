const brandFilterCheckboxes = document.querySelectorAll(".brand-filter-checkbox");
const categoryFilterBtns = document.querySelectorAll(".category-filter-btn");

brandFilterCheckboxes.forEach(brandFilterCheckbox => {
    brandFilterCheckbox.addEventListener("change", e => {
        const url = new URL(location.href);
        if(url.searchParams.has("company", e.target.value)) url.searchParams.delete("company", e.target.value);
        else url.searchParams.set("company", e.target.value);
        location.href = url;
    });
});

categoryFilterBtns.forEach(categoryFilterBtn => {
    categoryFilterBtn.addEventListener("click", e => {
        const url = new URL(location.href);
        if(url.searchParams.has("category", e.target.value)) url.searchParams.delete("category", e.target.value);
        else url.searchParams.set("category", e.target.value);
        location.href = url;
    });
});

document.getElementById("price-filter-btn").addEventListener("click", e => {
    const minPrice = parseInt(document.getElementById("min-price-input").value);
    const maxPrice = parseInt(document.getElementById("max-price-input").value);
    const url = new URL(location.href);
    if(minPrice && maxPrice) {
        url.searchParams.set("minPrice", minPrice);
        url.searchParams.set("maxPrice", maxPrice);
    } else {
        url.searchParams.delete("minPrice");
        url.searchParams.delete("maxPrice");
    }
    location.href = url;
});