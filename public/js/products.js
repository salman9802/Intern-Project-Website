// const brandFilterForm = document.getElementById("brand-filter-form");
// const categoryFilterForm = document.getElementById("category-filter-form");
const brandFilterCheckboxes = document.querySelectorAll(".brand-filter-checkbox");
const categoryFilterBtns = document.querySelectorAll(".category-filter-btn");

// brandFilterForm.addEventListener("submit", e => {
//     console.log("jfldksjklj");
//     e.preventDefault();
// });

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