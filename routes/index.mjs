import express from "express";

import ProductRoutes from "./ProductRoutes.mjs";

const router = express.Router();

router.get("/", (req, res) => res.render("index"));

// Product Routes
router.use("/products", ProductRoutes);

export default router;