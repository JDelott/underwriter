import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'jacobdelott',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'underwriter_dev',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text: string, params?: unknown[]) => {
  return pool.query(text, params);
};

export default pool;
