import mongoose from "mongoose";

export const dbConnect = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("Environment variable MONGODB_URI not found");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Connecting to database...");

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Database connection error: ", err);
  });
};
