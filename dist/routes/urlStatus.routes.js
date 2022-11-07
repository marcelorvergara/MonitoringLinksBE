"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const urlStatus_controller_1 = __importDefault(require("../controllers/urlStatus.controller"));
const router = express_1.default.Router();
router.get("/:id", urlStatus_controller_1.default.getUrlMonitorsByUser);
router.use((err, req, _res, next) => {
    const errorStr = `Method ${req.method}; URL ${req.baseUrl}; Error msg: ${err.message}`;
    next(errorStr);
});
exports.default = router;
