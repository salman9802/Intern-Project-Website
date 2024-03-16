import express from "express";

import ProductModel from "../models/ProductModel.mjs";


const COOKIE_CART_KEY_NAME = "ca-shopnest-rt", COOKIE_CART_EXPIRE_DAYS = 30;

const router = express.Router();

router.get("/checkout", (req, res) => {
    const cartProducts = JSON.parse(req.signedCookies[COOKIE_CART_KEY_NAME]);
    if(!cartProducts) res.redirect("/");
    else {
        const total = cartProducts.reduce((accumulator, currValue) => accumulator + currValue.price, 0);
        res.status(200).render("checkout", {
            cartProducts,
            total
        });
    }
});

router.post("/cart/add/:slug", async (req, res) => {
    const { slug } = req.params;
    const productFound = await ProductModel.find({slug}, {url: false, desc: false}).catch(err => {
        res.sendStatus(500);
    });
    if(!productFound) res.redirect("/");
    else {
        const productToAdd = productFound[0];
        // Get existing cookies if any
        let cartProducts = JSON.parse(req.signedCookies[COOKIE_CART_KEY_NAME] ? req.signedCookies[COOKIE_CART_KEY_NAME] : "[]");
        // if(!cartProducts) cartProducts = [];

        cartProducts.push(productToAdd);
        // Set cookie
        res.cookie(COOKIE_CART_KEY_NAME, JSON.stringify(cartProducts), {signed: true, maxAge: new Date(Date.now() + (COOKIE_CART_EXPIRE_DAYS * 24 * 60 * 60 * 1000))});
        res.redirect("/user/checkout");
    }
});

export default router;