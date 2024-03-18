import mongoose from "mongoose";

// The strict option, (enabled by default), ensures that values added to our model instance that were not specified in our schema do not get saved to the db.
const WhatsappApiResponseSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    }
}, { collection: "whatsapp_api_responses", strict: false });

export default mongoose.model("whatsapp_api_responses", WhatsappApiResponseSchema);