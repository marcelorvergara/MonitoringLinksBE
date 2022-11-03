import { IUrlStatus } from "../interfaces/IUrlStatus";
import { connect } from "./db";

export async function insertUrlStatus(results: IUrlStatus[]) {
  const conn = await connect();
  const resultsQuery: IUrlStatus[] = [];
  try {
    for (const result of results) {
      const sql =
        "INSERT INTO urlStatus (status, load_time, url_id) VALUES ($1, $2, $3) RETURNING *";
      const values = [result.status, result.load_time, result.url_id];
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
