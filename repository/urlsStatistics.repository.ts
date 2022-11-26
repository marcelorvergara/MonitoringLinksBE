import { connect } from "./db";

async function getUrlsStatisticsByUser(user_id: string) {
  const conn = await connect();
  try {
    const res = await conn.query(
      `SELECT urls.url, MAX(urlstatus.load_time), MIN(urlstatus.load_time), AVG(urlstatus.load_time)
      FROM urls  
      INNER JOIN urlStatus 
      ON urls.url_id = urlstatus.url_id 
      WHERE urls.user_id = $1
      GROUP BY url`,
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
  getUrlsStatisticsByUser,
};
