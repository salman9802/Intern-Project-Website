import dotenv from "dotenv";
dotenv.config();

import ProductModel from "../models/ProductModel.mjs";
import WhatsappMessage from "../wi/WhatsappMessage.mjs";
import WhatsappApiResponseModel from "../models/WhatsappApiResponseModel.mjs";


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
        const userName = req.body.user_name;
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
                        text: userName // User name
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
        
        // Save api response in MongoDB
        new WhatsappApiResponseModel({
            response,
            error: err?.error
        }).save();

        res.render("product", {
            product,
            response: {
                status: response ? "success" : "failure",
                to: response ? response.contacts[0].input : undefined,
                messageID: response ? response.messages[0].id : undefined,
                messageStatus: response ? response.messages[0].message_status : undefined,
                err
            }
        });

    }
}