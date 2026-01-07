import express from "express";
import { generalMethods } from "./General_routes.js";
import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import { z } from "zod";
import { auth } from "../middelware/auth.middelware.js";

// Define schema for techstack validation
const schema = z.object({
  username: z.string(),
  hashedPassword: z.string(),
  role: z.string().default("user"),
});

// Initialize database and collection
const database = getDatabase();
collectionExists("user");
const Collection = database.collection("user");

// Destructure general methods for the techstack collection
const { getAll, getById, create, updateById, deleteById } = generalMethods(
  Collection,
  schema
);

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
  await create(req, res);
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
