import express from "express";
import multer from "multer";
import Project from "../models/project.model.js";

const projectRoute = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/projects");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// get all projects
projectRoute.get("/projects", async (req, res) => {
  try {
    const result = await Project.find({});

    console.log(
      "Projects found:",
      result.map((x) => x.title)
    );

    return res.status(200).send({
      status: "ok",
      message: "Projects found!",
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

// create a new project
projectRoute.post("/project", upload.single("image"), async (req, res) => {
  try {
    let body = req.body;

    if (!body.image || !body.title || !body.description) {
      return res.status(400).send({
        status: "error",
        message: `Name and description is required`,
      });
    }

    const newProject = await Project.create(body);

    return res.status(201).send({
      status: "ok",
      message: "Project created successfully!",
      data: newProject,
    });
  } catch (error: any) {
    console.error("Something went wrong:", error);
    return res.status(500).send({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// update a project by id
projectRoute.put("/project/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "ID is required",
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).send({
        status: "error",
        message: "Project not found",
      });
    }

    return res.status(200).send({
      status: "ok",
      message: "Project updated successfully!",
      data: updatedProject,
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

// delete a project by id
projectRoute.delete("/project/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "ID is required",
      });
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).send({
        status: "error",
        message: "Project not found",
      });
    }

    return res.status(200).send({
      status: "ok",
      message: "Project deleted successfully!",
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

export default projectRoute;
