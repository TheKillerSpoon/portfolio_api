import { ObjectId } from "mongodb";
import { z } from "zod";
export const generalMethods = (Collection, schema) => {
    const getAll = async (req, res) => {
        try {
            const FoundAll = await Collection.find({}).toArray();
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
            const found = await Collection.findOne({
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
            const created = await Collection.insertMany(parsedBody);
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
            const parsedBody = body.map((item) => schema
                .strict()
                .refine((obj) => Object.keys(obj).length > 0, {
                message: "At least one field must be provided",
            })
                .parse(item));
            const updated = await Collection.updateOne({ _id: new ObjectId(id) }, { $set: parsedBody });
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
            const deleted = await Collection.deleteMany({
                _id: { $in: id.map((id) => new ObjectId(id)) },
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
