import express from "express";

//import { dbConnectionStatus } from "./lib/dbStatus.ts";

//await dbConnectionStatus();

const app = express();

// Home route - HTML
app.get("/", (req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Test API</title>
      </head>
      <body>
        <h1>API i up and running</h1>
      </body>
    </html>
  `);
});

export default app;
