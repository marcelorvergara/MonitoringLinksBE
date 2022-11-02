"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function createUrlMonitor(url) {
    const conn = await (0, db_1.connect)();
    try {
        const sql = "INSERT INTO urls (url, user_id) VALUES ($1, $2) RETURNING *";
        const values = [url.url, url.user_id];
        const res = await conn.query(sql, values);
        return res.rows[0];
    }
    catch (err) {
        throw err;
    }
    finally {
        conn.release();
    }
}
async function getUrlMonitors() {
    const conn = await (0, db_1.connect)();
    try {
        const res = await conn.query("Select * from urls");
        return res.rows;
    }
    catch (err) {
        throw err;
    }
    finally {
        conn.release();
    }
}
exports.default = {
    createUrlMonitor,
    getUrlMonitors,
};
