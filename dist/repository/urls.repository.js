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
        const res = await conn.query("Select * from urls ");
        return res.rows;
    }
    catch (err) {
        throw err;
    }
    finally {
        conn.release();
    }
}
async function getUrls(id) {
    const conn = await (0, db_1.connect)();
    try {
        const res = await conn.query("Select * from urls where user_id = $1", [id]);
        return res.rows;
    }
    catch (err) {
        throw err;
    }
    finally {
        conn.release();
    }
}
async function deleteUrl(id) {
    const conn = await (0, db_1.connect)();
    try {
        // first delete status for this url
        const delStatus = await conn.query("Delete from urlStatus where url_id = $1", [id]);
        const res = await conn.query("Delete from urls where url_id = $1 RETURNING *", [id]);
        return res.rows[0];
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
    getUrls,
    deleteUrl,
};
