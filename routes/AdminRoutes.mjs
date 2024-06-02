import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import { login, addProduct, removeProduct } from "../controllers/AdminController.mjs";
import ProductModel from "../models/ProductModel.mjs";
import { fetchCartProducts } from "../controllers/UserController.mjs";

const router = express.Router();

// enable session
router.use(session({
    secret: process.env.ADMIN_SESSION_KEY,
    name: "ad-shop-min-nest",
    cookie: {
        path: "/admin",
        maxAge: process.env.ADMIN_SESSION_EXPIRE_MIN * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));


router.get("/", (req, res) => {
    if(req.session.admin) { // if already logged in
        res.status(200).render("admin/home");
    } else {
        res.status(200).redirect("/admin/login");
    }
});

router.get("/login", (req, res) => {
    if(req.session.admin) res.redirect("/admin");
    else res.render("admin/login");
});

router.post("/login", login);


router.get("/add-product", (req, res) => {
    if(req.session.admin) { // if already logged in
        res.status(200).render("admin/add-product");
    } else {
        res.status(200).redirect("/admin/login");
    }
});

router.post("/add-product", addProduct);


router.get("/remove-product", async (req, res) => {
    if(req.session.admin) { // if already logged in
        const { category, s, company, minPrice, maxPrice } = req.query;

        const filter = {};

        if(category) filter["category"] = category;
        if(company) filter["company"] = company;
        if(s) filter["$text"] = {$search: s};
        if(minPrice || maxPrice) filter["price"] =  {$gte: parseInt(minPrice), $lte: parseInt(maxPrice)};
        
        const filteredProducts = await ProductModel.find(filter).catch(err => {
            res.sendStatus(500);
        });

        if(!filteredProducts) res.status(404);
        else {
            res.status(200).render("admin/remove-product", {
                query: req.query,
                products: filteredProducts,
                cartProducts: fetchCartProducts(req, res)
            });
        }
    } else {
        res.status(200).redirect("/admin/login");
    }
});

router.post("/remove-product", removeProduct);

router.get("/logout", (req, res) => {
    req.session.admin = undefined;
    req.session.save(function (err) {
        if (err) next(err)
        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
          if (err) next(err)
          res.redirect('/admin')
        })
      })
});
export default router;