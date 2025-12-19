import express from "express";
import { generalMethods } from "./General_routes.js";
import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import { z } from "zod";
// Define schema for test validation
const schema = z.object({
    name: z.string(),
    description: z.string(),
    timeframe: z.string().optional(),
});
// Initialize database and collection
const database = getDatabase();
collectionExists("language");
const Collection = database.collection("language");
// Destructure general methods for the test collection
const { getAll, getById, create, updateById, deleteById } = generalMethods(Collection, schema);
const languageRoute = express.Router();
// get all tests
languageRoute.get("/languages", async (req, res) => {
    await getAll(req, res);
});
// get test by id
languageRoute.get("/language/:id", async (req, res) => {
    await getById(req, res);
});
// create new test
languageRoute.post("/language", async (req, res) => {
    await create(req, res);
});
// update test by id
languageRoute.patch("/language/:id", async (req, res) => {
    await updateById(req, res);
});
// delete one or many test by id
languageRoute.delete("/language", async (req, res) => {
    await deleteById(req, res);
});
export default languageRoute;
