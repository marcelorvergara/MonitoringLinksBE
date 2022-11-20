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
    const res = await conn.query("Select * from urls ");
    return res.rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

async function getUrls(id: string) {
  const conn = await connect();
  try {
    const res = await conn.query("Select * from urls where user_id = $1", [id]);
    return res.rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

async function deleteUrl(id: string) {
  const conn = await connect();
  try {
    // first delete status for this url
    const delStatus = await conn.query(
      "Delete from urlStatus where url_id = $1",
      [id]
    );
    const res = await conn.query(
      "Delete from urls where url_id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export default {
  createUrlMonitor,
  getUrlMonitors,
  getUrls,
  deleteUrl,
};
