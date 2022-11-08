"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const urls_controller_1 = __importDefault(require("../controllers/urls.controller"));
const router = express_1.default.Router();
router.post("/", urls_controller_1.default.createUrlMonitor);
router.get("/:id", urls_controller_1.default.getUrls);
router.delete("/:id", urls_controller_1.default.deleteUrl);
router.use((err, req, _res, next) => {
    const errorStr = `Method ${req.method}; URL ${req.baseUrl}; Error msg: ${err.message}`;
    next(errorStr);
});
exports.default = router;
