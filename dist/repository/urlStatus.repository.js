"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUrlStatus = void 0;
const db_1 = require("./db");
async function insertUrlStatus(results) {
    console.log([...results]);
    const conn = await (0, db_1.connect)();
    const resultsQuery = [];
    try {
        for (const result of results) {
            const sql = "INSERT INTO urlStatus (status, load_time, url_id) VALUES ($1, $2, $3) RETURNING *";
            const values = [result.status, result.load_time, result.url_id];
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
