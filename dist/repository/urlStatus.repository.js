"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUrlStatus = void 0;
const db_1 = require("./db");
async function insertUrlStatus(results) {
    const conn = await (0, db_1.connect)();
    const resultsQuery = [];
    try {
        for (const result of results) {
            const now = new Date();
            const sql = "INSERT INTO urlStatus (status, load_time, url_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *";
            const values = [result.status, result.load_time, result.url_id, now];
            const res = await conn.query(sql, values);
            resultsQuery.push(res.rows[0]);
        }
        return resultsQuery;
    }
    catch (err) {
        throw err;
    }
    finally {
        conn.release();
    }
}
exports.insertUrlStatus = insertUrlStatus;
exports.default = {
    insertUrlStatus,
};
