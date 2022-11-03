import { IUrlStatus } from "../interfaces/IUrlStatus";
import { connect } from "./db";

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
};
