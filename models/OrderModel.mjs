import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: new Date()
    },
    complete: {
        type: String,
        required: true,
        default: "Not Complete"
    }
}, { collection: "orders", strict: false });

export default mongoose.model("orders", orderSchema);