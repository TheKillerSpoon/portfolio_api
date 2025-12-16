import { client } from "../utils/dbConnect.js";
import express from "express";

const testRoute = express.Router();

interface schemaTest {
  number: number;
  string: string;
  array?: number[];
}

await client.connect();

const myDB = client.db("portfolio");

const collectionList = myDB.listCollections({}, { nameOnly: true });

// test

console.log("Existing collections:", collectionList["documents"]);

if (
  collectionList["documents"] == null ||
  !collectionList["documents"].some((coll) => coll.name === "test")
) {
  await myDB.createCollection("test");
  console.log("Collection 'test' created");
}

console.log("TEST:", collectionList);

// test

var collExists = false;

for await (const doc of collectionList) {
  console.log("doc:", doc);
  if (doc.name === "test") {
    collExists = true;
  }
}
if (!collExists) {
  await myDB.createCollection("test");
  console.log("Collection 'test' created");
}

const myColl = myDB.collection<schemaTest>("test");

testRoute.get("/tests", async (req, res) => {
  try {
    const result = await myColl.find({}).toArray();

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
