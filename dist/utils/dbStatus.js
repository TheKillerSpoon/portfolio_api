import { client as dbClient } from "./dbConnect.js";
export default async function dbConnectionStatus() {
    if (!process.env.MONGODB_URI) {
        return "No MONGODB_URI environment variable";
    }
    if (!dbClient) {
        return "Database client not initialized";
    }
    try {
        console.log("connection...1");
        const client = await dbClient.connect();
        console.log("connection...2");
        const db = client.db("portfolio");
        console.log("connection...3");
        const result = await db.command({ ping: 1 });
        console.log("connection...4");
        console.log("MongoDB connection successful:", result);
        return "Database connected";
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        return "Database not connected";
    }
}
