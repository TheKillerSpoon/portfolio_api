import express from "express";
import { generalMethods } from "./General_routes.js";
import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import { z } from "zod";
import { auth } from "../middelware/auth.middelware.js";
import bcryptjs from "bcryptjs";
// Define schema for techstack validation
const schema = z.object({
    username: z.string(),
    hashedPassword: z.string(),
    role: z.string().default("user"),
});
// Initialize database and collection
const database = getDatabase();
collectionExists("user");
const collection = database.collection("user");
// Destructure general methods for the techstack collection
const { getAll, getById, updateById, deleteById } = generalMethods(collection, schema);
const userRoute = express.Router();
// get all techstacks
userRoute.get("/users", async (req, res) => {
    await getAll(req, res);
});
// get techstack by id
userRoute.get("/user/:id", async (req, res) => {
    await getById(req, res);
});
// create new techstack
userRoute.post("/user", async (req, res) => {
    try {
        let { username, password } = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = { username, hashedPassword };
        const parsedUser = schema
            .strict()
            .refine((obj) => Object.keys(obj).length > 0, {
            message: "At least one field must be provided",
        })
            .parse(user);
        const created = await collection.insertOne(parsedUser);
        return res.status(200).send({
            status: "ok",
            message: `Created successfully!`,
            data: created,
        });
    }
    catch (error) {
        console.error("Server error", error);
        if (error instanceof z.ZodError) {
            return res.status(400).send({
                status: "error",
                message: "Invalid request",
                error: error.issues,
            });
        }
        return res.status(500).send({
            status: "error",
            message: "Server error",
            error: error.message,
        });
    }
});
// update techstack by id
userRoute.patch("/user/:id", auth, async (req, res) => {
    await updateById(req, res);
});
// delete one or many techstack by id
userRoute.delete("/user", auth, async (req, res) => {
    await deleteById(req, res);
});
export default userRoute;
