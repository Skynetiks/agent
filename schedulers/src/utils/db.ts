import { Pool } from "pg";
import dotenv from "dotenv";
import { Logger } from "./logger";
import { env } from "./env";

dotenv.config();

const pool = new Pool({
  host: env.PG_HOST,
  port: env.PG_PORT,
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  database: env.PG_DATABASE,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: env.PG_SSL === "true",
});

export const query = async <T extends Object>(
  text: string,
  params?: any[]
): Promise<T[]> => {
  const client = await pool.connect();
  try {
    Logger.debug(`Executing query: ${text}`, { query: text });
    const res = await client.query<T>(text, params);
    return res.rows;
  } catch (error) {
    Logger.error(`Query Error: ${error}`, { query: text });
    throw error;
  } finally {
    client.release();
  }
};

// Graceful shutdown handler
const shutdown = async () => {
  Logger.info("🛑 Shutting down pool...");
  await pool.end();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
