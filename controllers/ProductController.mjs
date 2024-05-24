import fs from "fs";
import { dirname } from "node:path"; // buildin module from `node:` schema
import { fileURLToPath } from 'node:url';
import path from "path";
import { Readable } from "stream";

import dotenv from "dotenv";
dotenv.config();
import * as ejs from "ejs";
// import {default as HTMLToPDF} from "convert-html-to-pdf";
// import pdf from "pdf-creator-node";
import puppeteer from "puppeteer";

import ProductModel from "../models/ProductModel.mjs";
import WhatsappMessage from "../wi/WhatsappMessage.mjs";
import WhatsappApiResponseModel from "../models/WhatsappApiResponseModel.mjs";
import { emptyCart, fetchCartProducts } from "./UserController.mjs";
import OrderModel from "../models/OrderModel.mjs";


// __filename & __dirname not available in es6 files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function createInvoice(order) {
    const invoiceDate = new Date(order.createdAt);
    order.invoice_date = `${invoiceDate.getDate()}/${invoiceDate.getMonth() + 1}/${invoiceDate.getFullYear()}`;

    try {
        const html = fs.readFileSync("views/invoice-template.ejs");
        const invoiceHTML = ejs.render(html.toString(), {order});
        
        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 0,
            headless: true,
            defaultViewport: null
        });
        const page = await browser.newPage();

        await page.setContent(invoiceHTML, {waitUntil: "load"});
        await page.addStyleTag({url:"http://localhost/css/style.css"});

        const pdfStream = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return Readable.from(pdfStream);
    } catch(err) {
        console.log();
        console.log(err.message);
        console.log();
        console.log(err.stack);
        console.log();
    }

}

export async function checkoutController(req, res)  {
    const {
        fullName,
        phone,
        emailId,
        country,
        streetAddress,
        city,
        state,
        pincode,
        paymentMethod
    } = req.body;

    // Validations
    
    try {
        const cartProducts = fetchCartProducts(req, res);
        const totalAmount = cartProducts.reduce((accumulator, currValue) => accumulator + currValue.price, 0); // calculate total amount

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
            },
            total: totalAmount
        });
        order.save();
        res.order = order;

        // Send whatsapp message
        await sendOrderWhatsappMessage(req, res);
        
        // create invoice
        const invoice = await createInvoice(res.order);
        res.set("Content-Disposition", 'attachment; filename="invoice.pdf"')
        emptyCart(req, res);
        invoice.pipe(res);

        // // if(messageErr) {
        // if(false) {
        //     res.status(500).send("Cannot send whatsapp message");
        // }
        // else {
        //     res.render("order-successful", {order: {...order, redirectDuration: 3000}});
        // }

    } catch (err) {
        console.log();
        console.log(err.message);
        console.log();
        console.log(err.stack);
        console.log();
    }
};