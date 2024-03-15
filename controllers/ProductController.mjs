import dotenv from "dotenv";
dotenv.config();

import ProductModel from "../models/ProductModel.mjs";
import WhatsappMessage from "../wi/WhatsappMessage.mjs";
import WhatsappApiResponseModel from "../models/WhatsappApiResponseModel.mjs";


export async function fetchFeaturedProducts() {
    try {
        const featuredCategories = ["tv", "phone", "desktop", "laptop", "home-appliance", "ac"];
        const featuredProducts = [];

        for(const category of featuredCategories) {
            const categoryProducts = await ProductModel.find({category}).limit(2);
            featuredProducts.push(...categoryProducts)
        }

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

export async function fetchProducts(req, res) {
    const { category } = req.query;
    if(category) {
        const categoryProducts = await ProductModel.find({category});
        if(!categoryProducts) res.status(404);
        else {
            res.status(200).render("products", {
                products: categoryProducts
            });
        }
    } else {
        const products = await ProductModel.find();
        if(!products) res.status(404);
        else {
            res.status(200).render("products", {
                products
                // products: [
                //     products[0],
                //     products[1],
                //     products[2],
                //     products[3],
                // ]
            });
        }
    }
}

export async function sendWhatsapp(req, res) {
    const productFound = await ProductModel.find({ slug: req.params.slug }).catch(err => {
        res.sendStatus(500);
    });
    if(!productFound) res.sendStatus(404);
    else {
        const product = productFound[0];
        const userName = req.body.user_name;
        const to = process.env.WHATSAPP_TO;
        
        // Send whatsapp message
        const whatsappMessage = new WhatsappMessage();
        // const [ response, err ] = await whatsappMessage.sendTemplateMessage({
        //     to,
        //     messageHeader: {
        //         type: "header",
        //         parameters: [
        //             {
        //                 type: "text",
        //                 text: product.name // Product name
        //             }
        //         ]
        //     },
        //     messageBody: {
        //         type: "body",
        //         parameters: [
        //             {
        //                 type: "text",
        //                 text: userName // User name
        //             },
        //             {
        //                 type: "text",
        //                 text: product.description.join("\\n") // Product Description
        //             }
        //         ]
        //     },
        //     messageButton: {
        //         type: "button",
        //         sub_type: "url", // Button Type
        //         index: 0, // Button Index
        //         parameters: [
        //             {
        //                 type: "text",
        //                 text: product.slug 
        //             }
        //         ]
        //     }
        // });

        const [ response, err ] = await whatsappMessage.sendTemplateMessage({
            template: "test_template_2",
            to,
            messageHeader: {
                type: "header",
                parameters: [
                    {
                        type: "image",
                        image: {
                            link: product.absolute_img_url, // Product image url
                            // caption: product.name // Product caption
                        }
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
                        text: product.name // Product name
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
            response: response ? response : null,
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