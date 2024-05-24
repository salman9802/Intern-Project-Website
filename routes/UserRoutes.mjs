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

router.post("/cart/add/", async (req, res) => {
    const { slug } = req.body;

    const productFound = await ProductModel.find({slug}, {url: false}).catch(err => {
        res.status(500).json({ code: 500, msg: "Internal server error."});
    });

    if(!productFound || !productFound?.length) res.status(404).json({ code: 404, msg: "Product not found"});
    else {
        const productToAdd = productFound[0];

        const productInCart = addProductToCart(req, res, productToAdd);
        if(productInCart) {

            res.status(201).json({ code: 201, msg: "Product added to cart", addedProduct: productInCart });

            /* // fetchCartProduct doesn't include the current product after adding the cart
            // because the cookie was not set on client side.
            const updatedCartProducts = [...(fetchCartProducts(req, res))];
            const productExistInCart = updatedCartProducts.findIndex(p => p.slug === productToAdd.slug);
            if(productExistInCart === -1) updatedCartProducts.push({...(productToAdd._doc), quantity: 1}); // if product is added in cart first time
            else updatedCartProducts[productExistInCart]["quantity"] = parseInt(updatedCartProducts[productExistInCart]["quantity"]) + 1; // if product exsisted before
            res.render("product", {
                cartProducts: updatedCartProducts,
                add: { status: "OK", msg: "Product added to cart!" },
                product: productToAdd
            }); */

        }
        else {
            res.status(500).json({ code: 500, msg: "Product not found"});
        }
    }
});

// router.get("/cart/modify/:slug", (req, res) => {
//     const { slug } = req.params;
//     const { quantity, remove } = req.query;
//     if(remove) {
//         removeProductInCart(req, res, slug);
//         res.redirect("/");
//     } else if(quantity) {
//         modifyProductInCart(req, res, { quantity });
//         res.redirect("/");
//     }
//     // res.redirect("/");
// });

router.post("/cart/modify/:slug", (req, res) => {
    const { slug } = req.params;
    const { quantity, toRemove } = req.body;
    if(toRemove) {
        removeProductInCart(req, res, slug);
        res.status(201).json({code: 201, msg: "Product removed from cart."});
    } else if(quantity) {
        if(quantity > 0 && quantity < 11) modifyProductInCart(req, res, { quantity });
        res.status(201).json({code: 201, msg: "Product quantity changed."});
    }
});

export default router;