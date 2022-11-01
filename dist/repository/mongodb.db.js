"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const mongodb_1 = require("mongodb");
function getClient() {
    try {
        const uri = "mongodb+srv://mvergara:PtZzDyIhsqOZqnwJ@cluster0.sc0lygs.mongodb.net/?retryWrites=true&w=majority";
        return new mongodb_1.MongoClient(uri);
    }
    catch (err) {
        throw new Error(err);
    }
}
exports.getClient = getClient;
