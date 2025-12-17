import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import express from "express";
import { ObjectId } from "mongodb";
const testRoute = express.Router();
const database = getDatabase();
collectionExists("test");
const Collection = database.collection("test");
testRoute.get("/tests", async (req, res) => {
    try {
        const result = await Collection.find({}).toArray();
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
        if (!Array.isArray(body)) {
            body = [body];
        }
        body.map((item) => {
            if (!item.number || !item.string) {
                return res.status(400).send({
                    status: "error",
                    message: `Name and description is required on all items`,
                });
            }
        });
        const result = await Collection.insertMany(body);
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
// update test by id
testRoute.patch("/test/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        if (!id) {
            return res.status(400).send({
                status: "error",
                message: "ID is required",
            });
        }
        const updatedTest = await Collection.updateOne({ _id: new ObjectId(id) }, { $set: { body } });
        return res.status(200).send({
            status: "ok",
            message: "Test updated successfully!",
            data: updatedTest,
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
// delete one or many test by id
testRoute.delete("/test", async (req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            return res.status(400).send({
                status: "error",
                message: "One type of id is required",
            });
        }
        const deletedTest = await Collection.deleteMany({
            _id: { $in: id.map((id) => new ObjectId(id)) },
        });
        if (!deletedTest) {
            return res.status(404).send({
                status: "error",
                message: "Test not found",
            });
        }
        return res.status(200).send({
            status: "ok",
            message: "Test deleted successfully!",
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
