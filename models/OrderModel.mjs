import mongoose from "mongoose";

const orderSchema = mongoose.Schema({}, { collection: "orders", strict: false });

export default mongoose.model("orders", orderSchema);