
const COOKIE_CART_KEY_NAME = "ca-shopnest-rt", COOKIE_CART_EXPIRE_DAYS = 30;

export function fetchCartProducts(req, res) {
    const cart = req.signedCookies[COOKIE_CART_KEY_NAME];
    if(!cart) return [];
    else return JSON.parse(cart);
}

export function addProductToCart(req, res, product) {
    try {
        const cartProducts = fetchCartProducts(req, res); // Get existing products if any

        const productIndex = cartProducts.findIndex(p => p._id == product._id);
        if(productIndex === -1) cartProducts.push({...(product._doc), quantity: 1}); // add new product with initial quantity
        else {
            cartProducts[productIndex]["quantity"] = cartProducts[productIndex]["quantity"] + 1; // increment quantity
        }
        res.cookie(COOKIE_CART_KEY_NAME, JSON.stringify(cartProducts), {signed: true, maxAge: new Date(Date.now() + (COOKIE_CART_EXPIRE_DAYS * 24 * 60 * 60 * 1000))}); // set cookies
        return true;
    } catch (err) {
        console.log();
        console.error(err.message);
        console.log();
        console.error(err.stack);
        console.log();
        return false;
    }
}

export function modifyProductInCart(req, res, product) {
    try {
        const cartProducts = fetchCartProducts(req, res); // get exisiting products if any
        const productIndex = cartProducts.findIndex(product => product.slug === product.slug);
        if(productIndex === -1) return false; // product not found
        else {
            cartProducts[productIndex] = {...cartProducts[productIndex], ...product}; // modify specified properties
            res.cookie(COOKIE_CART_KEY_NAME, JSON.stringify(cartProducts), {signed: true, maxAge: new Date(Date.now() + (COOKIE_CART_EXPIRE_DAYS * 24 * 60 * 60 * 1000))}); // set cookies
            return true;
        }
    } catch (err) {
        console.log();
        console.error(err.message);
        console.log();
        console.error(err.stack);
        console.log();
        return false;
    }
}

export function removeProductInCart(req, res, slug) {
    try {
        let cartProducts = fetchCartProducts(req, res); // get exisiting products if any
        const productIndex = cartProducts.findIndex(product => product.slug === product.slug);
        if(productIndex === -1) return false; // product not found
        else {
            cartProducts = cartProducts.filter(product => product.slug !== slug); // remove specified product
            res.cookie(COOKIE_CART_KEY_NAME, JSON.stringify(cartProducts), {signed: true, maxAge: new Date(Date.now() + (COOKIE_CART_EXPIRE_DAYS * 24 * 60 * 60 * 1000))}); // set cookies
            return true;
        }
    } catch (err) {
        console.log();
        console.error(err.message);
        console.log();
        console.error(err.stack);
        console.log();
        return false;
    }
}

export function emptyCart(req, res) {
    res.cookie(COOKIE_CART_KEY_NAME, "[]", {signed: true, maxAge: new Date(Date.now() + (COOKIE_CART_EXPIRE_DAYS * 24 * 60 * 60 * 1000))}); // set cookies
}