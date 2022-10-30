import { MongoClient } from "mongodb";

function getClient() {
  const uri =
    "mongodb+srv://mvergara:PtZzDyIhsqOZqnwJ@cluster0.sc0lygs.mongodb.net/?retryWrites=true&w=majority";
  return new MongoClient(uri);
}

export { getClient };
