
const COOKIE_CART_KEY_NAME = "ca-shopnest-rt", COOKIE_CART_EXPIRE_DAYS = 30;

export function fetchCartProducts(req, res) {
    const cart = req.signedCookies[COOKIE_CART_KEY_NAME];
    if(!cart) return [];
    else return JSON.parse(cart);
    // JSON.parse(req.signedCookies[COOKIE_CART_KEY_NAME] ? req.signedCookies[COOKIE_CART_KEY_NAME] : "[]");
}

export function setCartProducts(req, res, product) {
    try {
        const cartProducts = fetchCartProducts(req, res); // Get existing products if any
        cartProducts.push(product); // add new product
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