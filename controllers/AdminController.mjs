import ProductModel from "../models/ProductModel.mjs";


export function login(req, res) {
    const { name, password } = req.body;
    if(name === "admin" && password === "admin") {
        req.session.admin = { name };
        res.redirect("/admin");
    } else res.redirect("/admin/login");
}

export function addProduct(req, res) {
    const {
        "product-name": productName,
        "product-price": productPrice,
        "product-img-url": productImageURL,
        "product-desc": productDesc,
        "product-category": productCategory,
        "product-company": productCompany
    } = req.body;
    
    // Validations


    const slug = productName.replace(/\s+/gm, "-")
    .replace(/[\/\\,\(\)]+/gm, "-");
    const lines = productDesc.split(/\r\n|(?!\r\n)[\n-\r\x85\u2028\u2029]/);

    try {
        const product = new ProductModel({
            slug,
            category: productCategory,
            company: productCompany,
            name: productName,
            img_url: productImageURL,
            price: parseInt(productPrice),
            desc: lines
        });

        product.save();
        res.redirect("/admin");
    } catch (err) {
        console.log(err);
    }

    
}