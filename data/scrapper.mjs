import fs from "fs";
import https from "https";

import axios from "axios";
import cheerio from "cheerio";
import got from "got";

class AmazonScrapper {
    static url = "https://www.amazon.in/s?k="; /* gives 503 server error */
    // static httpHeaders = {
        // "User-Agent": "axios 0.21.1"
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    // };

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
        fs.appendFileSync(file, ""); /* to create a file if it not exists */

        this.product = product;
        this.file = file;
        this.category = category;
    }

    static fetchHTML(url, cb) {
        let data = "";
        https.get("https://www.amazon.in/s?k=smartphone&crid=11TB0NHSHD7XH&sprefix=smartphone%2Caps%2C204&ref=nb_sb_noss_1", res => {
            console.log(`Status Code: ${res.statusCode}`);
            res.on("data", chunk => {
                data += chunk;
            });

            res.on("end", _ => {
                cb(data, null);
            });

            res.on("error", err => {
                cb(null, err);
            });
        });
    }

    async saveProducts() {
        // const url = `${AmazonScrapper.url}${this.product}`;
        const url = "https://www.amazon.in/s?k=smartphone&crid=11TB0NHSHD7XH&sprefix=smartphone%2Caps%2C204&ref=nb_sb_noss_1";
        console.log(url);
        try {
            const res = await axios.get(url, {
                headers: AmazonScrapper.httpHeaders
            });
            // const res = await fetch("https://www.amazon.in/s?k=smartphone&crid=11TB0NHSHD7XH&sprefix=smartphone%2Caps%2C204&ref=nb_sb_noss_1");
            // const res = got.get("https://www.amazon.in/s?k=smartphone&crid=11TB0NHSHD7XH&sprefix=smartphone%2Caps%2C204&ref=nb_sb_noss_1", AmazonScrapper.httpHeaders);
            // console.log(res);


            // AmazonScrapper.fetchHTML("https://www.amazon.in/s?k=smartphone&crid=11TB0NHSHD7XH&sprefix=smartphone%2Caps%2C204&ref=nb_sb_noss_1", (data, err) => {
            //     if(err) throw err;
            //     console.log(data);
            // });
            // return;
            
            const html = res.data;
            console.log(html);
            const $ = cheerio.load(html);
            const products = JSON.parse(new String(fs.readFileSync(this.file)).length) || []; /* load previous file data if any */
            
            $(AmazonScrapper.productEle).each((index, ele) => {
                const product = $(ele);
                const productName = product.find("span.a-size-medium.a-color-base.a-text-normal").text();
                const productImageUrl = product.find("img.s-image").attr("src");
                const productPrice = product.find("span.a-price-whole").text();
                const productUrl = product.find("span.a-size-medium.a-color-base.a-text-normal").attr("href");
                // const productDesc = product.find("").text();
                let productCompany = product.find("span.a-size-medium.a-color-base").text();
                // productCompany = productCompany.replace(productName, "");

                const productSlug = productName.replace(/\s+/gm, "-"); /* make slug for product */
                const productData = {
                    slug: productSlug,
                    category: this.category,
                    name: productName,
                    img_url: productImageUrl,
                    price: productPrice,
                    product_url: productUrl,
                    // desc
                };
                if(productCompany) productData["product_company"] = productCompany;
                products.push(productData);
            });
            console.log(products);

            fs.appendFileSync(this.file, JSON.stringify(products, null, 2));
            console.log(`Products '${this.category}' saved at '${this.file}'`);
        } catch (err) {
            console.log("-------------------------------------");
            console.error(err.message);
            console.log("-------------------------------------");
            console.error(err.stack);
            console.log("-------------------------------------");
        }
    }
}


const phoneScrapper = new AmazonScrapper({
    product: "Smartphones",
    category: "phone",
    file: "./phones.json"
});
await phoneScrapper.saveProducts();

// (async _ => {
//     await phoneScrapper.saveProducts();
// });

/*
async function fetchProducts(productUrl) {
    try {
        const response = await axios.get(productUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        const productClass = "div.a-section > div.puisg-row";

        const products = JSON.parse(fs.readFileSync("../data/products.json")) || [];
        $(productClass).each((_, ele) => {
            const product = $(ele);
            const productImage = product.find("img.s-image").attr("src");
            let productCompany = product.find("span.a-size-medium.a-color-base").text();
            let productName = product.find("span.a-size-medium.a-color-base.a-text-normal").text();
            // const productPrice = product.find("span.a-offscreen").text();
            const productPrice = product.find("span.a-price-whole").text();

            productCompany = productCompany.replace(productName, "");

            const productData = {
                img: productImage,
                company: productCompany,
                name: productName,
                price: productPrice
            };
            products.push(productData);
        });

        fs.writeFileSync("../data/products.json", JSON.stringify(products, null, 2));
        console.log("Products written successfully.");

    } catch (error) {
        console.log(error);
    }
}

productUrls.forEach(productUrl => fetchProducts(productUrl));
// fetchProducts();
*/