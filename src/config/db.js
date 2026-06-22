import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer = null;

export async function connectDB() {
  let uri = process.env.MONGO_URI;

  if (!uri || uri === "memory") {
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log("Using in-memory MongoDB for local development");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
