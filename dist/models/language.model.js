import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);
const languageSchema = new Schema({
    name: { type: String, required: [true, "Name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    timeframe: { type: String },
}, { timestamps: true });
export default mongoose.model("language", languageSchema);
