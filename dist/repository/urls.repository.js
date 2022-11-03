"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function createUrlMonitor(url) {
    const conn = await (0, db_1.connect)();
    try {
        const now = new Date();
        const sql = "INSERT INTO urls (url, user_id, created_at) VALUES ($1, $2, $3) RETURNING *";
        const values = [url.url, url.user_id, now];
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
async function getUrlMonitorsByUser(user_id) {
    const conn = await (0, db_1.connect)();
    try {
        const res = await conn.query("SELECT us.urlstatus_id, u.url, u.user_id, u.url_id, us.status, us.load_time, us.created_at FROM urls u INNER JOIN urlStatus us ON u.url_id = us.url_id where u.user_id = $1 ORDER BY us.urlstatus_id DESC LIMIT 15", [user_id]);
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
    getUrlMonitorsByUser,
};
