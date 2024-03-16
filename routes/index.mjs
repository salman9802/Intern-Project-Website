import express from "express";

import ProductRoutes from "./ProductRoutes.mjs";
import UserRoutes from "./UserRoutes.mjs";
import { fetchFeaturedProducts } from "../controllers/ProductController.mjs";
import { fetchCartProducts } from "../controllers/UserController.mjs";

const router = express.Router();

router.get("/", async (req, res) => res.render("index", {
    title: "ShopNest | Homepage",
    featured_products: await fetchFeaturedProducts(),
    cartProducts: fetchCartProducts(req, res)
}));

// Product Routes
router.use("/products", ProductRoutes);

// User Routes
router.use("/user", UserRoutes);

export default router;