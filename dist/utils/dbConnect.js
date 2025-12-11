import { attachDatabasePool } from "@vercel/functions";
import { MongoClient } from "mongodb";
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;
const options = {
    appName: "TheKillerSpoon-DB",
    maxIdleTimeMS: 5000,
};
export const client = new MongoClient(uri, options);
attachDatabasePool(client);
export async function getDatabase(dbName) {
    return client.db(dbName || process.env.MONGODB_DB || "better-auth");
}
