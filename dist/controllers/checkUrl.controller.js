"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function checkUrlSvc(req, res, next) {
    try {
        // restrict access to cron job
        console.log("header", req.headers["x-appengine-cron"]);
        if (req.headers["x-appengine-cron"] === "true") {
            // await CheckUrl.checkUrlSvc();
            res.send("Checks are going to start");
            logger.info(`GET /checkUrl - Checking urls`);
        }
        else {
            res.status(401).send("Unauthorized");
            logger.info(`GET /checkUrl - Unauthorized`);
        }
    }
    catch (err) {
        next(err);
    }
}
exports.default = {
    checkUrlSvc,
};
