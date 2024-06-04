import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import { login, addProduct, removeProduct } from "../controllers/AdminController.mjs";
import ProductModel from "../models/ProductModel.mjs";
import OrderModel from "../models/OrderModel.mjs";
import { fetchCartProducts } from "../controllers/UserController.mjs";

const router = express.Router();

// enable session
router.use(session({
    secret: process.env.ADMIN_SESSION_KEY,
    name: "ad-shop-min-nest",
    cookie: {
        path: "/admin",
        maxAge: process.env.ADMIN_SESSION_EXPIRE_MIN * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));


// middleware to handle login authentication
const authenticateLogin = (req, res, next) => {
    if(req.session.admin) next(); // if already logged in
    else res.render("admin/login");
};

router.get("/", authenticateLogin, (req, res) => {
    // if(req.session.admin) { // if already logged in
        res.status(200).render("admin/home");
    // } else {
    //     res.status(200).redirect("/admin/login");
    // }
});

router.get("/login", authenticateLogin, (req, res) => res.redirect("/admin"));

router.post("/login", login);

router.get("/logout", (req, res) => {
    req.session.admin = undefined;
    req.session.save(function (err) {
        if (err) next(err)
        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
          if (err) next(err)
          res.redirect('/admin')
        })
      })
});


router.get("/add-product", authenticateLogin, (req, res) => res.status(200).render("admin/add-product"));

router.post("/add-product", addProduct);


router.get("/remove-product", authenticateLogin, async (req, res) => {
    const { category, s, company, minPrice, maxPrice } = req.query;

    const filter = {};

    if(category) filter["category"] = category;
    if(company) filter["company"] = company;
    if(s) filter["$text"] = {$search: s};
    if(minPrice || maxPrice) filter["price"] =  {$gte: parseInt(minPrice), $lte: parseInt(maxPrice)};
    
    const filteredProducts = await ProductModel.find(filter).catch(err => {
        res.sendStatus(500);
    });

    if(!filteredProducts) res.status(404);
    else {
        res.status(200).render("admin/remove-product", {
            query: req.query,
            products: filteredProducts,
            cartProducts: fetchCartProducts(req, res)
        });
    }
});

router.post("/remove-product", authenticateLogin, removeProduct);


router.get("/manage-orders", authenticateLogin, async(req, res) => {
    try {
        let orders = await OrderModel.find();
        // filter orders not completed
        orders = orders.filter(order => order.complete !== "Complete");
        // Calculate total units and format date
        orders.forEach(order => {
            order.units = order.products.reduce((accumulator, currProduct) => accumulator + parseInt(currProduct.quantity), 0);

            const date = new Date(order.createdAt);
            order.datetime = `${date.toDateString()} ${date.toTimeString().substring(0, 8)}`;
        });
        res.status(200).render("admin/manage-orders", {
            orders
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.msg);
    }
});

router.get("/orders/:orderId", authenticateLogin, async(req, res) => {
    const { orderId } = req.params;
    if(!orderId) res.status(500).send("Server Error");
    else {
        const orders = await OrderModel.find({ _id: orderId }).catch(err => {
            res.status(500);
        });
        if(!orders) res.status(404).send("Order Not found");
        else {
            const order = orders[0];
            const date = new Date(order.createdAt);
            order.datetime = `${date.toDateString()} ${date.toTimeString().substring(0, 8)}`;
            order.addressStr = `${order.address.street_address}, ${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.pincode}`;
            res.render("admin/order", {
                order: order
            });
        }
    }
});

router.post("/orders/:orderId/complete", authenticateLogin, async(req, res) => {
    const { orderId } = req.params;
    if(!orderId) res.status(500).send("Server Error");
    else {
        const orders = await OrderModel.find({ _id: orderId }).catch(err => {
            res.status(500);
        });
        if(!orders) res.status(404).send("Order Not found");
        else {
            await OrderModel.updateOne({_id: orderId}, {complete: "Complete"});
            res.redirect("/admin");
        }
    }
});


router.get("/view-sales", authenticateLogin, async(req, res) => {
    const report = {};
    try {
        const completedOrders = await OrderModel.find({complete: "Complete"});
        if(completedOrders.length) {
            // total earned
            report.total_earned = completedOrders.reduce((accumulator, co) => accumulator + parseInt(co.total), 0);
            // sales
            report.sales = completedOrders.length;
            // units sold
            report.units_sold = completedOrders.reduce((accumulator, co) => accumulator + parseInt(co.products.reduce((acc, product) => acc + parseInt(product.quantity), 0)), 0);
            // average earned
            report.average_earned = (report.total_earned / report.units_sold).toFixed(2);
            // highest sold
            const soldPerCategory = {};
            completedOrders.forEach(co => {
                co.products.forEach(product => {
                    soldPerCategory[product.category] = soldPerCategory[product.category] === undefined ? 1 : soldPerCategory[product.category] + 1;
                });
            });
            report.highest_sold = Object.keys(soldPerCategory).reduce((a, b) => soldPerCategory[a] > soldPerCategory[b] ? a : b);
            // highest brand
            const soldPerBrand = {};
            completedOrders.forEach(co => {
                co.products.forEach(product => {
                    soldPerBrand[product.company] = soldPerBrand[product.company] === undefined ? 1 : soldPerBrand[product.company] + 1;
                });
            });
            report.highest_brand = Object.keys(soldPerBrand).reduce((a, b) => soldPerBrand[a] > soldPerBrand[b] ? a : b);
        } else {
            report.total_earned = 0;
            report.sales = 0;
            report.units_sold = 0;
            report.average_earned = 0;
            report.highest_sold = "N/A";
            report.highest_brand = "N/A";
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

    res.render("admin/view-sales", {
        report
    });
});

export default router;