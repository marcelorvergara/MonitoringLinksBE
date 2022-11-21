"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUrl_controller_1 = __importDefault(require("../controllers/checkUrl.controller"));
const router = express_1.default.Router();
router.get("/", checkUrl_controller_1.default.checkUrlSvc);
exports.default = router;
