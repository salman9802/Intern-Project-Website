import { dirname } from "node:path"; // buildin module from `node:` schema
import { fileURLToPath } from 'node:url';
import path from "path";

import express from "express";
import expressLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";


import defaultRoutes from "./routes/index.mjs";
import { connectDB } from "./config/db.mjs";
connectDB();

const PORT = 80;
const app = express();

// __filename & __dirname not available in es6 files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Set ejs layouts
app.use(expressLayouts);
// Set ejs view engine as ejs
app.set("view engine", "ejs");

// Setup express json & body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set url middleware
app.use((req, res, next) => {
    // req.locals._url_ = req.url;
    res.locals._url_ = req.url;
    next();
});

// Set cookie parser middleware
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));


// main routes
app.use("/", defaultRoutes);

app.listen(PORT, ['localhost', process.env.LOCAL_IP], _=> {
    console.log(`Server started at http://localhost:${PORT}`);
    if(process.env.LOCAL_IP) console.log(`Also at http://${process.env.LOCAL_IP}:${PORT}`);
});