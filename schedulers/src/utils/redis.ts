import { createClient } from "redis";
import { env } from "./env";

// Redis configuration interface
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

class RedisService {
  private static instance: RedisService;
  private client: ReturnType<typeof createClient>;
  private isConnected: boolean = false;

  private constructor(config: RedisConfig) {
    this.client = createClient({
      socket: {
        host: config.host,
        port: config.port,
      },
      password: config.password,
      database: config.db || 0,
    });

    this.setupEventListeners();
  }

  // Singleton pattern for Redis connection
  public static getInstance(config: RedisConfig): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService(config);
    }
    return RedisService.instance;
  }

  // Setup event listeners for connection management
  private setupEventListeners(): void {
    this.client.on("error", (err) => {
      console.error("Redis Client Error", err);
      this.isConnected = false;
    });

    this.client.on("connect", () => {
      console.log("Redis client connected");
      this.isConnected = true;
    });

    this.client.on("reconnecting", () => {
      console.log("Redis client reconnecting");
    });
  }

  // Establish connection
  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
      } catch (error) {
        console.error("Failed to connect to Redis", error);
        throw error;
      }
    }
  }

  // Disconnect from Redis
  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // Set value with optional expiration
  public async set(
    key: string,
    value: string,
    expirationInSeconds?: number
  ): Promise<void> {
    try {
      if (expirationInSeconds) {
        await this.client.set(key, value, {
          EX: expirationInSeconds,
        });
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error("Redis set error", error);
      throw error;
    }
  }

  // Get value
  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error("Redis get error", error);
      throw error;
    }
  }

  // Delete value
  public async delete(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error("Redis delete error", error);
      throw error;
    }
  }

  // Batch operations
  public async mset(keyValuePairs: Record<string, string>): Promise<void> {
    try {
      await this.client.mSet(keyValuePairs);
    } catch (error) {
      console.error("Redis mset error", error);
      throw error;
    }
  }

  public async mget(...keys: string[]): Promise<(string | null)[]> {
    try {
      return await this.client.mGet(keys);
    } catch (error) {
      console.error("Redis mget error", error);
      throw error;
    }
  }

  public async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error("Redis incr error", error);
      throw error;
    }
  }
}

const redisConfig: RedisConfig = {
  host: env.REDIS_HOST || "localhost",
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB,
};

export const redis = RedisService.getInstance(redisConfig);
