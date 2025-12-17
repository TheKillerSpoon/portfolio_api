import { Schema, model, connect } from "mongoose";
const testSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
});
const User = model("User", testSchema);
await connect("mongodb://127.0.0.1:27017/test");
const user = new User({
    name: "Bill",
    email: "bill@initech.com",
    avatar: "https://i.imgur.com/dM7Thhn.png",
});
await user.save();
const email = user.email;
console.log(email); // 'bill@initech.com'
