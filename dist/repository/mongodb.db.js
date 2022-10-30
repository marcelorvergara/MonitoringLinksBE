"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const mongodb_1 = require("mongodb");
function getClient() {
    const uri = "mongodb+srv://mvergara:PtZzDyIhsqOZqnwJ@cluster0.sc0lygs.mongodb.net/?retryWrites=true&w=majority";
    return new mongodb_1.MongoClient(uri);
}
exports.getClient = getClient;
