import { connect } from "./db";

async function getUrlsStatisticsByUser(user_id: string) {
  const conn = await connect();
  try {
    const res = await conn.query(
      `SELECT urls.url, MAX(urlstatus.load_time), MIN(urlstatus.load_time), AVG(urlstatus.load_time), urls.warning_th, urls.danger_th
        FROM urls
        INNER JOIN urlStatus
        ON urls.url_id = urlstatus.url_id
        WHERE urls.user_id = $1
        GROUP BY urls.url_id
        ORDER BY urls.url_id
         `,
      [user_id]
    );
    return res.rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

async function getLastSixHour(user_id: string) {
  const conn = await connect();
  try {
    const res = await conn.query(
      `SELECT u.url, us.load_time, us.created_at, u.warning_th, danger_th
        FROM urls u
        INNER JOIN urlStatus us
        ON u.url_id = us.url_id
        WHERE us.created_at >= now() - interval '6 hour' AND  u.user_id = $1
        ORDER BY u.url_id, us.created_at`,
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
  getLastSixHour,
};
