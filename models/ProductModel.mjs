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

// https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
productSchema.index({name: "text", "name": "text"});

export default mongoose.model("products", productSchema);