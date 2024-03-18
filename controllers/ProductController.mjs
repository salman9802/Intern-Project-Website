import dotenv from "dotenv";
dotenv.config();

import ProductModel from "../models/ProductModel.mjs";
import WhatsappMessage from "../wi/WhatsappMessage.mjs";
import WhatsappApiResponseModel from "../models/WhatsappApiResponseModel.mjs";
import { emptyCart, fetchCartProducts } from "./UserController.mjs";
import OrderModel from "../models/OrderModel.mjs";


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
            product,
            cartProducts: fetchCartProducts(req, res)
        });
    }
}

export async function fetchProducts(req, res) {
    const { category, q } = req.query;
    if(category) {
        const categoryProducts = await ProductModel.find({category});
        if(!categoryProducts) res.status(404);
        else {
            res.status(200).render("products", {
                products: categoryProducts,
                cartProducts: fetchCartProducts(req, res)
            });
        }
    } else if(q) {
        const queriedProducts = await ProductModel.find({ $text: {$search: q} });
        if(!queriedProducts) res.redirect("/");
        else {
            res.render("products", {
                products: queriedProducts,
                cartProducts: fetchCartProducts(req, res)
            });
        }
    } else {
        const products = await ProductModel.find();
        if(!products) res.status(404);
        else {
            res.status(200).render("products", {
                products,
                cartProducts: fetchCartProducts(req, res)
            });
        }
    }
}

export async function sendWhatsapp(req, res) {
    // const productFound = await ProductModel.find({ slug: req.params.slug }).catch(err => {
    //     res.sendStatus(500);
    // });
    // if(!productFound) res.sendStatus(404);
    // else {
        // const product = productFound[0];
        // console.log(product);
        const {
            "contact.full_name":customerName,
            _id: orderId,
            createdAt,
            products,
        } = res.order;
        
        const orderDetailStr = products.reduce((accumulator, currValue) => accumulator + `${currValue.name} - ₹${currValue.price}\\n\\n`, "");
        const totalAmount = products.reduce((accumulator, currValue) => accumulator + currValue.price, 0);
        
        const to = process.env.WHATSAPP_TO;
        
        // Send whatsapp message
        const whatsappMessage = new WhatsappMessage();
        /* 
            1 - company name
            2 - customer name
            3 - order id
            4 - order datetime
            5 - order details(
            - Laptop - ₹500 )
            6 - total amount
        */

        const [ response, err ] = await whatsappMessage.sendTemplateMessage({
            template: "test_template_2",
            to,
            messageHeader: {
                type: "header",
                parameters: [
                    {
                        type: "image",
                        image: {
                            link: "https://www.mgt-commerce.com/astatic/assets/images/article/2023/225/hero.svg?v=1.0.2", // Product image url
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
                        text: process.env.WHATSAPP_COMPANY_NAME // Company name
                    },
                    {
                        type: "text",
                        text: customerName // customer name
                    },
                    {
                        type: "text",
                        text: process.env.WHATSAPP_COMPANY_NAME // Company name
                    },
                    {
                        type: "text",
                        text: orderId // order id
                    },
                    {
                        type: "text",
                        text: createdAt // date time
                    },
                    {
                        type: "text",
                        text: orderDetailStr // order details
                    },
                    {
                        type: "text",
                        text: `₹${totalAmount.toLocaleString()}` // total amount
                    }
                ]
            },
            // messageButton: {
            //     type: "button",
            //     sub_type: "url", // Button Type
            //     index: 0, // Button Index
            //     parameters: [
            //         {
            //             type: "text",
            //             text: product.slug 
            //         }
            //     ]
            // }
        });
        
        // Save api response in MongoDB
        new WhatsappApiResponseModel({
            response: response ? response : null,
            error: err?.error
        }).save();

        // res.render("product", {
        //     product,
        //     response: {
        //         status: response ? "success" : "failure",
        //         to: response ? response.contacts[0].input : undefined,
        //         messageID: response ? response.messages[0].id : undefined,
        //         messageStatus: response ? response.messages[0].message_status : undefined,
        //         err
        //     }
        // });
    // }
}

async function sendOrderWhatsappMessage(req, res) {
    try {
        const {
            _id: orderId,
            createdAt,
            products,
        } = res.order;
        const customerName = res.order.contact["full_name"];

        const orderDetailStr = products.reduce((accumulator, currValue) => accumulator + `${currValue.name} - ₹${currValue.price}\\n\\n`, "");
        const totalAmount = products.reduce((accumulator, currValue) => accumulator + currValue.price, 0);
        
        const to = process.env.WHATSAPP_TO;
        
        // Send whatsapp message
        const whatsappMessage = new WhatsappMessage();
        /* 
            1 - company name
            2 - customer name
            3 - order id
            4 - order datetime
            5 - order details(
            - Laptop - ₹500 )
            6 - total amount
        */
    
        const [ response, err ] = await whatsappMessage.sendTemplateMessage({
            template: "test_order_template",
            to,
            messageHeader: {
                type: "header",
                parameters: [
                    {
                        type: "image",
                        image: {
                            link: "https://cdn.vectorstock.com/i/preview-1x/86/54/flat-isometric-3d-complete-order-vector-45108654.jpg", // Order complete image
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
                        text: process.env.WHATSAPP_COMPANY_NAME // Company name
                    },
                    {
                        type: "text",
                        text: customerName // customer name
                    },
                    {
                        type: "text",
                        text: orderId // order id
                    },
                    {
                        type: "text",
                        text: createdAt.toLocaleString() // date time
                    },
                    {
                        type: "text",
                        text: orderDetailStr // order details
                    },
                    {
                        type: "text",
                        text: `₹${totalAmount.toLocaleString()}` // total amount
                    }
                ]
            }
        });
        if(err) throw err;
        
        new WhatsappApiResponseModel({
            response: response ? response : null,
            error: err?.error
        }).save();
        return null;
    } catch (err) {
        return err;
    }
}

export async function checkoutController(req, res)  {
    const {
        "full-name": fullName,
        phone,
        "email-id": emailId,
        country,
        "street-address": streetAddress,
        city,
        state,
        pincode
    } = req.body;

    // Validations
    
    try {
        const cartProducts = fetchCartProducts(req, res);

        // Add order in db
        const order = new OrderModel({
            products: cartProducts,
            contact: {
                "full_name": fullName,
                phone,
                email_id: emailId
            },
            address: {
                country,
                street_address: streetAddress,
                city,
                state,
                pincode
            }
        });
        order.save();
        res.order = order;

        // Send whatsapp message
        const messageErr = await sendOrderWhatsappMessage(req, res);
        if(messageErr) {
            res.status(500).send("Cannot send whatsapp message");
        }
        else {
            emptyCart(req, res);
            res.send(`Order Successful!. Order id: ${order._id}`);
        }

    } catch (err) {
        console.log();
        console.log(err.message);
        console.log();
        console.log(err.stack);
        console.log();
    }
};