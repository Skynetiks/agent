import { Pool } from "pg";
import { Logger } from "./logger";
import { env } from "./env";

dotenv.config();

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  idleTimeoutMillis: 30000, // 30 seconds
  max: 100, // Maximum concurrent connections
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
