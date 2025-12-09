import { client } from "../utils/dbConnect.js";
import express from "express";

const testRoute = express.Router();

interface schemaTest {
  number: number;
  string: string;
  array: number[];
}

const myDB = client.db("portfolio");

const myColl = myDB.collection<schemaTest>("test");

testRoute.get("/tests", async (req, res) => {
  try {
    const result = await myColl.find({});

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
  } finally {
    await client.close();
  }
});

// create new test
testRoute.post("/test", async (req, res) => {
  try {
    let body = req.body;

    if (!body.name || !body.description) {
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
  } catch (error: any) {
    console.error("Server error", error);
    return res.status(500).send({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  } finally {
    await client.close();
  }
});

export default testRoute;
