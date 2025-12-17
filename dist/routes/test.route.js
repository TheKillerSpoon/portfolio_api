import express from "express";
import { generalMethods } from "./General_routes.js";
const { getAll, getById, create, updateById, deleteById } = generalMethods();
const testRoute = express.Router();
testRoute.get("/tests", async (req, res) => {
    await getAll(req, res);
});
testRoute.get("/test/:id", async (req, res) => {
    await getById(req, res);
});
// create new test
testRoute.post("/test", async (req, res) => {
    await create(req, res);
});
// update test by id
testRoute.patch("/test/:id", async (req, res) => {
    await updateById(req, res);
});
// delete one or many test by id
testRoute.delete("/test", async (req, res) => {
    await deleteById(req, res);
});
export default testRoute;
