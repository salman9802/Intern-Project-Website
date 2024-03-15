import mongoose from "mongoose";


const productSchema = mongoose.Schema({
    slug: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    name: {
        type:String,
        required:true
    },
    img_url: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: [String]
}, {
    collection: "products"
});

export default mongoose.model("products", productSchema);