import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: new Date()
    }
}, { collection: "orders", strict: false });

export default mongoose.model("orders", orderSchema);