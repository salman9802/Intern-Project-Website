import express from "express";

const router = express.Router();

router.get("/checkout", (req, res) => {
    res.status(200).render("checkout");
});

export default router;