import express from "express";

import products from "../data/products.mjs";
import sendMessage from "../wi/sendMessage.mjs";

const router = express.Router();

router.get("/:slug", (req, res) => {
    products.forEach(product => {
        if(product.slug === req.params.slug) {
            res.render("product", {
                ...product
            });
        }
    });
});

router.post("/:slug", async (req, res) => {
    const product = products.filter(product => product.slug === req.params.slug)[0];
    if(!product) res.status(500).send("No product found.");
    else {
        const { name, price, desc } = product;
        // Send whatsapp message
        sendMessage(product)
            .then(response => {
                res.status(200).json({msg: "Whatsapp message send", response});
            })
            .catch(err => {
                res.status(500).json({msg: "Cannot send message", err: err});
            });
    }
});


export default router;