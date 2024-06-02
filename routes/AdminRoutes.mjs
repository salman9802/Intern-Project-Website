import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import { login, addProduct } from "../controllers/AdminController.mjs";

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
    // if(req.session.admin) { // if already logged in
        res.status(200).render("admin/home");
    // } else {
    //     res.status(200).redirect("/admin/login");
    // }
});

router.get("/login", (req, res) => {
    if(req.session.admin) res.redirect("/admin");
    else res.render("admin/login");
});

router.post("/login", login);

router.get("/add-product", (req, res) => {
    // if(req.session.admin) { // if already logged in
    res.status(200).render("admin/add-product");
    // } else {
    //     res.status(200).redirect("/admin/login");
    // }
});

router.post("/add-product", addProduct);

export default router;