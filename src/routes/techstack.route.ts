import express from "express";
import { generalMethods } from "./General_routes.js";
import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import { z } from "zod";

// Define schema for techstack validation
const schema = z.object({
  name: z.string(),
  description: z.string(),
  catagory: z.string(),
  timeframe: z.string().optional(),
});

// Initialize database and collection
const database = getDatabase();
collectionExists("techstack");
const Collection = database.collection("techstack");

// Destructure general methods for the techstack collection
const { getAll, getById, create, updateById, deleteById } = generalMethods(
  Collection,
  schema
);

const techstackRoute = express.Router();

// get all techstacks
techstackRoute.get("/techstacks", async (req, res) => {
  await getAll(req, res);
});

// get techstack by id
techstackRoute.get("/techstack/:id", async (req, res) => {
  await getById(req, res);
});

// create new techstack
techstackRoute.post("/techstack", async (req, res) => {
  await create(req, res);
});

// update techstack by id
techstackRoute.patch("/techstack/:id", async (req, res) => {
  await updateById(req, res);
});

// delete one or many techstack by id
techstackRoute.delete("/techstack", async (req, res) => {
  await deleteById(req, res);
});

export default techstackRoute;
