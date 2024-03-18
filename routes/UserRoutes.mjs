import express from "express";

import ProductModel from "../models/ProductModel.mjs";
import OrderModel from "../models/OrderModel.mjs";
import { fetchCartProducts, addProductToCart, removeProductInCart, modifyProductInCart, emptyCart } from "../controllers/UserController.mjs";
import { checkoutController, sendWhatsapp } from "../controllers/ProductController.mjs";


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

router.post("/checkout", checkoutController);

router.get("/cart/add/:slug", async (req, res) => {
    const { slug } = req.params;
    const productFound = await ProductModel.find({slug}, {url: false}).catch(err => {
        res.sendStatus(500);
    });
    if(!productFound) res.redirect("/");
    else {
        const productToAdd = productFound[0];

        if(addProductToCart(req, res, productToAdd)) {
            // fetchCartProduct doesn't include the current product after adding the cart
            // because the cookie was not set on client side.
            const updatedCartProducts = [...(fetchCartProducts(req, res))];
            const productExistInCart = updatedCartProducts.findIndex(p => p.slug === productToAdd.slug);
            if(productExistInCart === -1) updatedCartProducts.push({...(productToAdd._doc), quantity: 1}); // if product is added in cart first time
            else updatedCartProducts[productExistInCart]["quantity"] = updatedCartProducts[productExistInCart]["quantity"] + 1; // if product exsisted before
            res.render("product", {
                cartProducts: updatedCartProducts,
                add: { status: "OK", msg: "Product added to cart!" },
                product: productToAdd
            });
        }
        else res.redirect("/");
    }
});

router.get("/cart/modify/:slug", (req, res) => {
    const { slug } = req.params;
    const { quantity, remove } = req.query;
    if(remove) {
        removeProductInCart(req, res, slug);
        res.redirect("/");
    } else if(quantity) {
        modifyProductInCart(req, res, { quantity });
        res.redirect("/");
    }
    // res.redirect("/");
});

export default router;