import express from "express";

import products from "../data/products.mjs";

const router = express.Router();

router.get("/:url", (req, res) => {
    products.forEach(product => {
        if(product.url === req.params.url) {
            res.render("product", {
                ...product
            });
        }
    });
});

router.post("/:url", (req, res) => {
    const product = products.filter(product => product.url === req.params.url)[0];
    if(!product) res.status(500).send("No product found.");
    else {
        console.log(product);
        const { name, price, desc } = product;
        // Send whatsapp message

        res.status(200).json({msg: "Whatsapp message send", product: {name, price, desc}});
    }
});


export default router;