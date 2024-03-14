import fs from "fs";
import https from "https";

import axios from "axios";
import cheerio from "cheerio";
import got from "got";

/* 
    Product data format:
    {
        slug: slug for product,
        category: product category [ac, phone, tv, desktop, laptop, home-appliance],
        name: product name,
        img_url: absolute url for product image,
        price: product price,
        description: array of product features
    }
*/


class AmazonScraper {
    static url = "https://www.amazon.in/s?k="; /* gives 503 server error */

    // Headers from firefox worked!
    static httpHeaders = {
        "Host": "www.amazon.in",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        // "Cookie": "session-id=258-1494432-1271344; session-id-time=2082787201l; i18n-prefs=INR; csm-hit=tb:s-Y2D432MTNDN46X6FQ6FP|1710327381988&t:1710327384377&adb:adblk_yes; ubid-acbin=257-5521592-3812209",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    }

    // static url = "https://www.amazon.in/s?crid=11TB0NHSHD7XH&sprefix=smartphone%2Caps%2C204&ref=nb_sb_noss_1&k=";
    static productEle = "div.a-section > div.puisg-row";

    constructor({product, file, category}) {
        if(!product) throw new Error("'product' not specified");
        if(!file || !file.endsWith(".json")) throw new Error("'file' should be json file");
        if(!category) throw new Error("'category' not specified");
        // fs.writeFileSync(file, "", {flag: "w"}); /* to create a file if it not exists */

        this.product = product;
        this.file = file;
        this.category = category;
    }

    async saveProducts() {
        const url = `${AmazonScraper.url}${this.product}`;
        console.log(url);
        try {
            const res = await axios.get(url, {
                headers: AmazonScraper.httpHeaders
            });
            
            const html = res.data;
            const $ = cheerio.load(html);
            // const products = JSON.parse((fs.readFileSync(this.file).toString().length != 0) ? (fs.readFileSync(this.file)).toString() : "[]"); /* load previous file data if any */

            this.products = (!fs.existsSync(this.file) || fs.statSync(this.file).size == 0) ? [] : JSON.parse(fs.readFileSync(this.file).toString()); // load previous file data if any 

            const productElems = $(AmazonScraper.productEle).toArray(); // get all product html elements
            for(let i = 0; i < productElems.length; i++) {
                process.stdout.write(`\r${this.product} Products (${i}/${productElems.length})`);
                const product = $(productElems[i]);

                const productName = product.find("span.a-size-medium.a-color-base.a-text-normal").text();
                const productImageUrl = product.find("img.s-image").attr("src");
                const productPrice = product.find("span.a-price-whole").text();
                const productUrl = `http://www.amazon.in/${product.find("a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal").attr("href")}`;
                let productCompany = product.find("span.a-size-medium.a-color-base").text();
                
                const productDesc = []; // Product Description lines
                const productPageResponse = await axios.get(productUrl, { headers: AmazonScraper.httpHeaders });
                const productPageHtml = productPageResponse.data; // Product Page
                const productPage = cheerio.load(productPageHtml);
                // productPage("#feature-bullets span.a-list-item").each((index, ele) => { // features bullet points
                //     const line = productPage(ele).text();
                //     productDesc.push(line);
                // });

                const lines = productPage("#feature-bullets span.a-list-item").toArray();
                for(let i = 0; i < lines.length; i++) {
                    const line = productPage(lines[i]).text();
                    productDesc.push(line);
                }

                const productSlug = productName.replace(/\s+/gm, "-"); // make slug for product 

                const productData = {
                    slug: productSlug,
                    category: this.category,
                    name: productName,
                    img_url: productImageUrl,
                    price: productPrice,
                    product_url: productUrl,
                    product_desc: productDesc
                };
                if(productCompany) productData["product_company"] = productCompany;
                this.products.push(productData);
            }

            // console.log(this.products);

            fs.writeFileSync(this.file, JSON.stringify(this.products, null, 2));
            console.log(`Products '${this.category}' saved at '${this.file}'`);
        } catch (err) {
            console.log("\n-------------------------------------");
            console.error(err.message);
            console.log("Writing fetched data...");
            fs.writeFileSync(this.file, JSON.stringify(this.products, null, 2));
            console.log(`Products '${this.category}' saved at '${this.file}'`);
            console.log("-------------------------------------");
            console.error(err.stack);
            console.log("-------------------------------------");
        }
    }
}


/* const phoneScraper = new AmazonScraper({
    product: "Smartphones",
    category: "phone",
    file: "./phones.json"
});
await phoneScraper.saveProducts(); */

/* const acScraper = new AmazonScraper({
    product: "Air Conditioners",
    category: "ac",
    file: "./ac.json"
});
await acScraper.saveProducts(); */

// const tvcraper = new AmazonScraper({
//     product: "Television",
//     category: "tv",
//     file: "./tv.json"
// });
// await tvcraper.saveProducts();

// const desktopScraper = new AmazonScraper({
//     product: "Desktops",
//     category: "desktop",
//     file: "./desktop.json"
// });
// await desktopScraper.saveProducts();

// const laptopScraper = new AmazonScraper({
//     product: "Laptops",
//     category: "laptop",
//     file: "./laptop.json"
// });
// await laptopScraper.saveProducts();

// const homeApplianceScraper = new AmazonScraper({
//     product: "Home Appliances",
//     category: "home-appliance",
//     file: "./home-appliance.json"
// });
// await homeApplianceScraper.saveProducts();