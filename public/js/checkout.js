const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", e => {
    e.preventDefault(); // prevent refresh of page

    // update UI (add loader)
    const orderBtn = document.getElementById("order-btn")
    orderBtn.classList.remove("primary-btn-full");
    orderBtn.classList.remove("hover:before:translate-x-0");
    orderBtn.classList.remove("hover:text-black");
    
    orderBtn.classList.add("bg-black");
    orderBtn.classList.add("text-white");
    orderBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="#000" stroke-width="4"></circle>
      <path class="opacity-75" fill="#FFF" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>PROCESSING...</span>
    `;

    const form = e.target;
    const fullName = form["full-name"].value;
    const phone = form["phone"].value;
    const emailId = form["email"].value;
    const country = form["country"].value;
    const streetAddress = form["street-address"].value;
    const city = form["city"].value;
    const state = form["state"].value;
    const pincode = form["pincode"].value;
    const paymentMethod = form["payment"].value;

    fetch("/user/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ fullName, phone, emailId, country, streetAddress, city, state, pincode, paymentMethod})
    })
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "invoice.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            location.replace("/");
        });
});