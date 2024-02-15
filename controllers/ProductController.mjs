import ProductModel from "../models/ProductModel.mjs";
import sendMessage from "../wi/sendMessage.mjs";

export async function fetchFeaturedProducts() {
    try {
        const featuredProducts = await ProductModel.find().limit(7);
        return featuredProducts;
    }catch(err) {
        return [];
    }
}

export async function fetchProduct(req, res) {
    const slug = req.params.slug;
    const productFound = await ProductModel.find({ slug: slug}).catch(err => {
        res.sendStatus(500);
    });
    if(!productFound) res.redirect("/");
    else {
        const product = productFound[0];
        res.render("product", {
            product
        });
    }
}

export async function sendWhatsapp(req, res) {
    const productFound = await ProductModel.find({ slug: req.params.slug }).catch(err => {
        res.sendStatus(500);
    });
    if(!productFound) res.sendStatus(404);
    else {
        const product = productFound[0];
        // Send whatsapp message
        sendMessage(product)
            .then(response => {
                res.status(200).json({msg: "Whatsapp message send", response});
            })
            .catch(err => {
                res.status(500).json({msg: "Cannot send message", err: err});
            });
    }
}