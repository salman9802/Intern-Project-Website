import express from "express";

import { fetchProduct, sendWhatsapp } from "../controllers/ProductController.mjs";

const router = express.Router();

router.get("/:slug", fetchProduct);


router.post("/:slug", sendWhatsapp);

// router.post("/:slug", async (req, res) => {
//     const product = products.filter(product => product.slug === req.params.slug)[0];
//     if(!product) res.status(500).send("No product found.");
//     else {
//         // Send whatsapp message
//         sendMessage(product)
//             .then(response => {
//                 res.status(200).json({msg: "Whatsapp message send", response});
//             })
//             .catch(err => {
//                 res.status(500).json({msg: "Cannot send message", err: err});
//             });
//     }
// });


export default router;