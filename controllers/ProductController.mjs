import dotenv from "dotenv";
dotenv.config();

import ProductModel from "../models/ProductModel.mjs";
import WhatsappMessage from "../wi/WhatsappMessage.mjs";
// import sendMessage from "../wi/sendMessage.mjs";

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
        const username = "Salman";
        const product = productFound[0];
        const to = process.env.WHATSAPP_TO;
        
        // Send whatsapp message
        const whatsappMessage = new WhatsappMessage();
        const [ response, err ] = await whatsappMessage.sendTemplateMessage({
            to,
            messageHeader: {
                type: "header",
                parameters: [
                    {
                        type: "text",
                        text: product.name // Product name
                    }
                ]
            },
            messageBody: {
                type: "body",
                parameters: [
                    {
                        type: "text",
                        text: username // User name
                    },
                    {
                        type: "text",
                        text: product.description.join("\\n") // Product Description
                    }
                ]
            },
            messageButton: {
                type: "button",
                sub_type: "url", // Button Type
                index: 0, // Button Index
                parameters: [
                    {
                        type: "text",
                        text: product.slug 
                    }
                ]
            }
        });
        if(response) res.status(200).json({msg: "Whatsapp message send", response});
        else res.status(500).json({msg: "Cannot send message", err: err});
        // sendMessage(product)
        //     .then(response => {
        //         res.status(200).json({msg: "Whatsapp message send", response});
        //     })
        //     .catch(err => {
        //         res.status(500).json({msg: "Cannot send message", err: err});
        //     });

    }
}