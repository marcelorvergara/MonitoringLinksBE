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

async function getUrlMonitorsByUser(user_id: number) {
  const conn = await connect();
  try {
    const res = await conn.query(
      "SELECT us.urlstatus_id, u.url, u.user_id, u.url_id, us.status, us.load_time FROM urls u INNER JOIN urlStatus us ON u.url_id = us.url_id where u.user_id = $1 ORDER BY us.urlstatus_id DESC LIMIT 15",
      [user_id]
    );
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
  getUrlMonitorsByUser,
};
