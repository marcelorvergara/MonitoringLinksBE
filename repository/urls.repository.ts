import { IUrl } from "../interfaces/IUrl";
import { connect } from "./db";

async function createUrlMonitor(url: IUrl) {
  const conn = await connect();
  try {
    const now = new Date();
    const sql =
      "INSERT INTO urls (url, user_id, created_at) VALUES ($1, $2, $3) RETURNING *";
    const values = [url.url, url.user_id, now];
    const res = await conn.query(sql, values);
    return res.rows[0];
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

async function getUrlMonitors() {
  const conn = await connect();
  try {
    const res = await conn.query("Select * from urls");
    return res.rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export default {
  createUrlMonitor,
  getUrlMonitors,
};
