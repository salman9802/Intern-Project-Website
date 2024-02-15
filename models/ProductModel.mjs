import mongoose from "mongoose";


const productSchema = mongoose.Schema({
    slug: String,
    name: String,
    img_url: String,
    absolute_img_url: String,
    price: Number,
    description: [String]
}, {
    collection: "Products"
});

export default mongoose.model("Products", productSchema);