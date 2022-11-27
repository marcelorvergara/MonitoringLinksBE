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

async function getLastHour(user_id: string) {
  const conn = await connect();
  //WHERE us.created_at BETWEEN '2022-11-24 23:55:00'::timestamp AND now()::timestamp AND  u.user_id = $1
  try {
    const res = await conn.query(
      `SELECT u.url, us.load_time, us.created_at
        FROM urls u
        INNER JOIN urlStatus us
        ON u.url_id = us.url_id
        WHERE us.created_at >= now() - interval '1 hour' AND  u.user_id = $1
        ORDER BY us.created_at`,
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
  getLastHour,
};
