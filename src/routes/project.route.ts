import express from "express";
import { generalMethods } from "./General_routes.js";
import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import { z } from "zod";
import multer from "multer";

// Define schema for test validation
const schema = z.object({
  image: z.string().optional(),
  title: z.string(),
  description: z.string(),
  live: z.string().optional(),
  git: z.string(),
  languages: z.array(z.string()),
  showcase: z.boolean().default(false),
});

// Initialize database and collection
const database = getDatabase();
collectionExists("project");
const Collection = database.collection("project");

// Destructure general methods for the test collection
const { getAll, getById, create, updateById, deleteById } = generalMethods(
  Collection,
  schema
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/projects");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const projectRoute = express.Router();

// get all tests
projectRoute.get("/projects", async (req, res) => {
  await getAll(req, res);
});

// get test by id
projectRoute.get("/project/:id", async (req, res) => {
  await getById(req, res);
});

// create new test
projectRoute.post("/project", upload.single("image"), async (req, res) => {
  await create(req, res);
});

// update test by id
projectRoute.patch("/project/:id", upload.single("image"), async (req, res) => {
  await updateById(req, res);
});

// delete one or many test by id
projectRoute.delete("/project", async (req, res) => {
  await deleteById(req, res);
});

export default projectRoute;
