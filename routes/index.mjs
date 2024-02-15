import express from "express";

import ProductRoutes from "./ProductRoutes.mjs";
import { fetchFeaturedProducts } from "../controllers/ProductController.mjs";

const router = express.Router();

router.get("/", async (req, res) => res.render("index", {
    title: "Junaid Al Atoor | Homepage",
    featured_products: await fetchFeaturedProducts()
}));

// Product Routes
router.use("/products", ProductRoutes);

export default router;