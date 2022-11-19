import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
function getClient() {
  try {
    const uri = process.env.MONGO_CONN;
    return new MongoClient(uri!);
  } catch (err: any) {
    throw new Error(err);
  }
}

export { getClient };
