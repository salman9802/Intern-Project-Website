import express from "express";

import ProductRoutes from "./ProductRoutes.mjs";
import UserRoutes from "./UserRoutes.mjs";
import AdminRoutes from "./AdminRoutes.mjs";
import { fetchFeaturedProducts } from "../controllers/ProductController.mjs";
import { fetchCartProducts } from "../controllers/UserController.mjs";

const router = express.Router();

// Homepage
router.get("/", async (req, res) => res.render("index", {
    title: "ShopNest | Homepage",
    featured_products: await fetchFeaturedProducts(),
    cartProducts: fetchCartProducts(req, res)
}));

// Invoice template
router.get("/templates/invoice", (req, res) => res.render("invoice-template", {order: {
    _id: 12345,
    contact: {
        full_name: "John Doe"
    },
    invoice_date: "23/05/2024",
    address: {
        city: "Pune",
        state: "Maharashtra",
        country: "India"
    },
    products: {
        name: "Sample Product",
        price: "100",
        quantity: "1"
    },
    total: "100"
}}));

// Product Routes
router.use("/products", ProductRoutes);

// User Routes
router.use("/user", UserRoutes);

// Admin Routes
router.use("/admin", AdminRoutes);

export default router;