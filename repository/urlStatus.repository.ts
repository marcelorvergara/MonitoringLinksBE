import { IUrlStatus } from "../interfaces/IUrlStatus";
import { connect } from "./db";

async function getUrlMonitorsByUser(user_id: string) {
  const conn = await connect();
  try {
    const res = await conn.query(
      "SELECT us.urlstatus_id, u.url, u.user_id, u.url_id, us.status, us.load_time, us.created_at, u.warning_th, u.danger_th FROM urls u INNER JOIN urlStatus us ON u.url_id = us.url_id where u.user_id = $1 ORDER BY us.urlstatus_id DESC LIMIT 15",
      [user_id]
    );
    return res.rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export async function insertUrlStatus(results: IUrlStatus[]) {
  const conn = await connect();
  const resultsQuery: IUrlStatus[] = [];
  try {
    for (const result of results) {
      const now = new Date();
      const sql =
        "INSERT INTO urlStatus (status, load_time, url_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *";
      const values = [result.status, result.load_time, result.url_id, now];
      const res = await conn.query(sql, values);
      resultsQuery.push(res.rows[0]);
    }
    return resultsQuery;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export default {
  insertUrlStatus,
  getUrlMonitorsByUser,
};
