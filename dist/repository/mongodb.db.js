"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getClient() {
    try {
        const uri = process.env.MONGO_CONN;
        return new mongodb_1.MongoClient(uri);
    }
    catch (err) {
        throw new Error(err);
    }
}
exports.getClient = getClient;
