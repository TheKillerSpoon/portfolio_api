import express from "express";
import { generalMethods } from "./General_routes.js";
import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import { z } from "zod";
import { auth } from "../middelware/auth.middelware.js";

// Define schema for test validation
const schema = z.object({
  number: z.number(),
  string: z.string(),
  test: z.string(),
  array: z.array(z.number()).optional(),
});

// Initialize database and collection
const database = getDatabase();
collectionExists("test");
const Collection = database.collection("test");

// Destructure general methods for the test collection
const { getAll, getById, create, updateById, deleteById } = generalMethods(
  Collection,
  schema,
);

const testRoute = express.Router();

// get all tests
testRoute.get("/tests", async (req, res) => {
  await getAll(req, res);
});

// get test by id
testRoute.get("/test/:id", async (req, res) => {
  await getById(req, res);
});

// create new test
testRoute.post("/test", auth, async (req, res) => {
  await create(req, res);
});

// update test by id
testRoute.patch("/test/:id", auth, async (req, res) => {
  await updateById(req, res);
});

// delete one or many test by id
testRoute.delete("/test/:id", auth, async (req, res) => {
  await deleteById(req, res);
});

export default testRoute;
