import { attachDatabasePool } from "@vercel/functions";
import { MongoClient } from "mongodb";
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;
const options = {
    appName: "portfolio_api",
    maxIdleTimeMS: 5000,
};
export const client = new MongoClient(uri, options);
attachDatabasePool(client);
export function getDatabase() {
    return client.db("portfolio");
}
export async function collectionExists(collectionName) {
    const db = getDatabase();
    const collectionList = db.listCollections({}, { nameOnly: true });
    var collExists = false;
    for await (const doc of collectionList) {
        if (doc.name === collectionName) {
            collExists = true;
        }
    }
    if (!collExists) {
        await db.createCollection(collectionName);
        console.log(`Collection '${collectionName}' created`);
    }
}
