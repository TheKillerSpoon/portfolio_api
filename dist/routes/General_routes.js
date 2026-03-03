import { ObjectId } from "mongodb";
import { z } from "zod";
export const generalMethods = (collection, schema) => {
    const getAll = async (req, res) => {
        try {
            const FoundAll = await collection.find({}).toArray();
            return res.status(200).send({
                status: "ok",
                message: `Found all!`,
                data: FoundAll,
            });
        }
        catch (error) {
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
            const found = await collection.findOne({
                _id: new ObjectId(id),
            });
            return res.status(200).send({
                status: "ok",
                message: `Found!`,
                data: found,
            });
        }
        catch (error) {
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
            const parsedBody = body.map((item) => schema
                .strict()
                .refine((obj) => Object.keys(obj).length > 0, {
                message: "At least one field must be provided",
            })
                .parse(item));
            const created = await collection.insertMany(parsedBody);
            return res.status(200).send({
                status: "ok",
                message: `Created successfully!`,
                data: created,
            });
        }
        catch (error) {
            console.error("Server error", error);
            if (error instanceof z.ZodError) {
                return res.status(400).send({
                    status: "error",
                    message: "Invalid request",
                    error: error.issues,
                });
            }
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
            const parsedBody = schema
                .strict()
                .refine((obj) => Object.keys(obj).length > 0, {
                message: "At least one field must be provided",
            })
                .parse(body);
            const updated = await collection.updateOne({ _id: new ObjectId(id) }, { $set: parsedBody });
            return res.status(200).send({
                status: "ok",
                message: `Updated successfully!`,
                data: updated,
            });
        }
        catch (error) {
            console.error("Server error", error);
            if (error instanceof z.ZodError) {
                return res.status(400).send({
                    status: "error",
                    message: "Invalid request",
                    error: error.issues,
                });
            }
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
            console.log("Deleting with ID:", id);
            const deleted = await collection.deleteOne({
                _id: new ObjectId(id),
            });
            console.log("Delete result:", deleted);
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
        }
        catch (error) {
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
