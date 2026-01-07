import express from "express";
import cors from "cors";
import dbConnectionStatus from "./utils/dbStatus.js";
await dbConnectionStatus();
import techstackRoute from "./routes/techstack.route.js";
import projectRoute from "./routes/project.route.js";
import testRoute from "./routes/test.route.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(techstackRoute);
app.use(projectRoute);
app.use(testRoute);
app.use(authRoute);
app.use(userRoute);
// Home route - HTML
app.get("/", (req, res) => {
    res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>portfolio API</title>
      </head>
      <body>
        <h1>API i up and running</h1>
      </body>
    </html>
  `);
});
export default app;
