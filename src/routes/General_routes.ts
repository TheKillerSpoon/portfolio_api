import { ObjectId } from "mongodb";

export const generalMethods = (Collection, schema) => {
  const getAll = async (req, res) => {
    try {
      const FoundAll = await Collection.find({}).toArray();

      return res.status(200).send({
        status: "ok",
        message: `Found all!`,
        data: FoundAll,
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

      const found = await Collection.findOne({
        _id: new ObjectId(id as string),
      });

      return res.status(200).send({
        status: "ok",
        message: `Found!`,
        data: found,
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

      for (const item of body) {
        const result = schema
          .strict()
          .refine((obj) => Object.keys(obj).length > 0, {
            message: "At least one field must be provided",
          })
          .parse(item);

        if (!result.success) {
          return res.status(400).send({
            status: "error",
            message: "Invalid request",
            error: result.error.issues,
          });
        }
      }

      const created = await Collection.insertMany(body);

      return res.status(200).send({
        status: "ok",
        message: `Created successfully!`,
        data: created,
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

      const result = schema
        .partial()
        .strict()
        .refine((obj) => Object.keys(obj).length > 0, {
          message: "At least one field must be provided",
        })
        .parse(body);

      if (!result.success) {
        return res.status(400).send({
          status: "error",
          message: "Invalid request",
          error: result.error.issues,
        });
      }

      const updated = await Collection.updateOne(
        { _id: new ObjectId(id as string) },
        { $set: body }
      );

      return res.status(200).send({
        status: "ok",
        message: `Updated successfully!`,
        data: updated,
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

      const deleted = await Collection.deleteMany({
        _id: { $in: id.map((id) => new ObjectId(id as string)) },
      });

      if (!deleted) {
        return res.status(404).send({
          status: "error",
          message: `Not found`,
        });
      }

      return res.status(200).send({
        status: "ok",
        message: `Deleted successfully!`,
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
