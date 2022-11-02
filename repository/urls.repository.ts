import { IUrl } from "../interfaces/IUrl";
import { connect } from "./db";

async function createUrlMonitor(url: IUrl) {
  const conn = await connect();
  try {
    const sql = "INSERT INTO urls (url, user_id) VALUES ($1, $2) RETURNING *";
    const values = [url.url, url.user_id];
    const res = await conn.query(sql, values);
    return res.rows[0];
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export default {
  createUrlMonitor,
};
