import express from "express";

import ProductModel from "../models/ProductModel.mjs";
import { fetchCartProducts, addProductToCart } from "../controllers/UserController.mjs";


const router = express.Router();

router.get("/checkout", (req, res) => {
    const cartProducts = fetchCartProducts(req, res);
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

        if(addProductToCart(req, res, productToAdd)) res.redirect("/user/checkout");
        else res.redirect("/");
    }
});

export default router;