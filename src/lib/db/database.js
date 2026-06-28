import pg from 'pg';
const { Pool } = pg;
import { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } from './secret.js';

let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    user: PG_USER,
    password: PG_PASSWORD,
    host: PG_HOST,
    port: parseInt(PG_PORT || '6543', 10),
    database: PG_DATABASE,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  if (!global.pgPool) {
    global.pgPool = new Pool({
      user: PG_USER,
      password: PG_PASSWORD,
      host: PG_HOST,
      port: parseInt(PG_PORT || '6543', 10),
      database: PG_DATABASE,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  pool = global.pgPool;
}

export const query = (text, params) => pool.query(text, params);
export default pool;
