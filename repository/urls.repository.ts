import { IUrl } from "../interfaces/IUrl";
import { connect } from "./db";

async function createUrlMonitor(url: IUrl) {
  const conn = await connect();
  try {
    const now = new Date();
    const sql =
      "INSERT INTO urls (url, user_id, created_at, warning_th, danger_th, sms_whatsapp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [
      url.url,
      url.user_id,
      now,
      url.warning_th,
      url.danger_th,
      url.sms_whatsapp,
    ];
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

async function getUrls(id: string) {
  const conn = await connect();
  try {
    const res = await conn.query(
      "Select * from urls where user_id = $1 order by url_id",
      [id]
    );
    return res.rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

async function deleteUrl(id: string, user: IUser) {
  const conn = await connect();
  try {
    // first delete status for this url
    const delStatus = await conn.query(
      "Delete from urlStatus where url_id = $1",
      [id]
    );
    const res = await conn.query(
      "Delete from urls where url_id = $1 and user_id = $2 RETURNING *",
      [id, user.id]
    );
    return res.rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

async function updateUrl(url: IUrl) {
  const conn = await connect();
  try {
    const sql =
      "UPDATE urls SET warning_th = $1, danger_th = $2, sms_whatsapp = $5 WHERE user_id = $3 AND url_id = $4 RETURNING *";
    const values = [
      url.warning_th,
      url.danger_th,
      url.user_id,
      url.url_id,
      url.sms_whatsapp,
    ];
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
  getUrlMonitors,
  getUrls,
  deleteUrl,
  updateUrl,
};
