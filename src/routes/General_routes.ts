import { getDatabase, collectionExists } from "../utils/dbConnect.js";
import { ObjectId } from "mongodb";

export const generalMethods = (collectionName?: string) => {
  interface schemaTest {
    number: number;
    string: string;
    array?: number[];
  }

  const database = getDatabase();

  collectionExists("test");

  const Collection = database.collection<schemaTest>("test");

  const getAll = async (req, res) => {
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
  };

  const getById = async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).send({
          status: "error",
          message: "ID is required",
        });
      }

      const result = await Collection.findOne({
        _id: new ObjectId(id as string),
      });

      return res.status(200).send({
        status: "ok",
        message: "Test found!",
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
  };
  const create = async (req, res) => {
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
    } catch (error: any) {
      console.error("Server error", error);
      return res.status(500).send({
        status: "error",
        message: "Server error",
        error: error.message,
      });
    }
  };
  const updateById = async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;

      if (!id) {
        return res.status(400).send({
          status: "error",
          message: "ID is required",
        });
      }

      const updatedTest = await Collection.updateOne(
        { _id: new ObjectId(id as string) },
        { $set: body }
      );

      return res.status(200).send({
        status: "ok",
        message: "Test updated successfully!",
        data: updatedTest,
      });
    } catch (error: any) {
      console.error("Server error", error);
      return res.status(500).send({
        status: "error",
        message: "Server error",
        error: error.message,
      });
    }
  };
  const deleteById = async (req, res) => {
    try {
      const id = req.body.id;

      if (!id) {
        return res.status(400).send({
          status: "error",
          message: "One type of id is required",
        });
      }

      const deletedTest = await Collection.deleteMany({
        _id: { $in: id.map((id) => new ObjectId(id as string)) },
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
    } catch (error: any) {
      console.error("Server error", error);
      return res.status(500).send({
        status: "error",
        message: "Server error",
        error: error.message,
      });
    }
  };

  return {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
  };
};
