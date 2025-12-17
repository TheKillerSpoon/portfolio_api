import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import express from "express";
const testRoute = express.Router();
const myDB = getDatabase();
collectionExists("test");
const myColl = myDB.collection("test");
testRoute.get("/tests", async (req, res) => {
    try {
        const result = await myColl.find({}).toArray();
        return res.status(200).send({
            status: "ok",
            message: "Tests found!",
            data: result,
        });
    }
    catch (error) {
        console.error("Server error", error);
        return res.status(500).send({
            status: "error",
            message: "Server error",
            error: error.message,
        });
    }
});
// create new test
testRoute.post("/test", async (req, res) => {
    try {
        let body = req.body;
        console.log("Request body:", body);
        if (!body.number || !body.string) {
            return res.status(400).send({
                status: "error",
                message: `Name and description is required`,
            });
        }
        const result = await myColl.insertOne(body);
        return res.status(200).send({
            status: "ok",
            message: "Test created successfully!",
            data: result,
        });
    }
    catch (error) {
        console.error("Server error", error);
        return res.status(500).send({
            status: "error",
            message: "Server error",
            error: error.message,
        });
    }
});
export default testRoute;
