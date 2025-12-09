import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);
const projectSchema = new Schema({
    image: { type: String, required: [true, "Image is required"] },
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    live: { type: String },
    git: { type: String, required: [true, "Github link is required"] },
    languages: { type: [Schema.Types.ObjectId], ref: "language", default: [] },
    showcase: { type: Boolean, default: false },
    timeframe: { type: String },
}, { timestamps: true });
export default mongoose.model("project", projectSchema);
