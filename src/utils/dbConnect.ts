import { attachDatabasePool } from "@vercel/functions";
import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  appName: "testapi-blond-psi.vercel.app",
  maxIdleTimeMS: 5000,
};

export const client = new MongoClient(uri, options);

attachDatabasePool(client);

export async function getDatabase(dbName?: string) {
  return client.db(dbName || process.env.MONGODB_DB || "better-auth");
}
