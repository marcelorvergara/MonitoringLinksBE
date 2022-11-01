import { MongoClient } from "mongodb";

function getClient() {
  try {
    const uri =
      "mongodb+srv://mvergara:PtZzDyIhsqOZqnwJ@cluster0.sc0lygs.mongodb.net/?retryWrites=true&w=majority";
    return new MongoClient(uri);
  } catch (err: any) {
    throw new Error(err);
  }
}

export { getClient };
