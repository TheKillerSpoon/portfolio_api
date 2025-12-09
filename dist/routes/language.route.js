import express from "express";
import Language from "../models/language.model.js";
const languageRoute = express.Router();
// get all languages
languageRoute.get("/languages", async (req, res) => {
    try {
        const result = await Language.find({});
        console.log("Languages found:", result.map((x) => x.name));
        return res.status(200).send({
            status: "ok",
            message: "Languages found!",
            data: result,
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
});
// get language by id
languageRoute.get("/language/:id", async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).send({
                status: "error",
                message: "Language ID is required",
            });
        }
        const language = await Language.findById(id);
        if (!language) {
            return res.status(404).send("Language not found");
        }
        res.status(200).send({
            status: "ok",
            message: "Language found!",
            data: language,
        });
    }
    catch (error) {
        console.error("Server-error", error);
        res.status(500).send("Server-error");
    }
});
// create a new language
languageRoute.post("/language", async (req, res) => {
    try {
        let body = req.body;
        if (!body.name || !body.description) {
            return res.status(400).send({
                status: "error",
                message: `Name and description is required`,
            });
        }
        const newLanguage = await Language.create(body);
        return res.status(201).send({
            status: "ok",
            message: "Language created successfully!",
            data: newLanguage,
        });
    }
    catch (error) {
        console.error("Something went wrong:", error);
        return res.status(500).send({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
});
// update a language by id
languageRoute.put("/language/:id", async (req, res) => {
    try {
        const id = req.query.id;
        const body = req.body;
        if (!id) {
            return res.status(400).send({
                status: "error",
                message: "ID is required",
            });
        }
        const updatedLanguage = await Language.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!updatedLanguage) {
            return res.status(404).send({
                status: "error",
                message: "Language not found",
            });
        }
        return res.status(200).send({
            status: "ok",
            message: "Language updated successfully!",
            data: updatedLanguage,
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
});
// delete a language by id
languageRoute.delete("/language/:id", async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).send({
                status: "error",
                message: "ID is required",
            });
        }
        const deletedLanguage = await Language.findByIdAndDelete(id);
        if (!deletedLanguage) {
            return res.status(404).send({
                status: "error",
                message: "Language not found",
            });
        }
        return res.status(200).send({
            status: "ok",
            message: "Language deleted successfully!",
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
});
export default languageRoute;
