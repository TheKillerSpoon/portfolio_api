import { client, getDatabase, collectionExists } from "../utils/dbConnect.js";
import express from "express";

const testRoute = express.Router();

interface schemaTest {
  number: number;
  string: string;
  array?: number[];
}

const database = getDatabase();

collectionExists("test");

const Collection = database.collection<schemaTest>("test");

testRoute.get("/tests", async (req, res) => {
  try {
    const result = await Collection.find({}).toArray();

    return res.status(200).send({
      status: "ok",
      message: "Tests found!",
      data: result,
    });
  } catch (error: any) {
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

    if (Array.isArray(body)) {
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
        message: "Tests created successfully!",
        data: result,
      });
    }

    if (!body.number || !body.string) {
      return res.status(400).send({
        status: "error",
        message: `Name and description is required`,
      });
    }

    const result = await Collection.insertMany(body);

    return res.status(200).send({
      status: "ok",
      message: "Test created successfully!",
      data: result,
    });
  } catch (error: any) {
    console.error("Server error", error);
    return res.status(500).send({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
});

export default testRoute;
