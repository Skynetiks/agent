import { createClient } from "redis";
import { env } from "./env";
import { Logger } from "./logger";

// Redis configuration interface
interface RedisConfig {
  url: string;
}

class RedisService {
  private static instance: RedisService;
  private client: ReturnType<typeof createClient>;
  private isConnected: boolean = false;

  private constructor(config: RedisConfig) {
    this.client = createClient({
      url: config.url,
    });

    this.setupEventListeners();
  }

  public static getInstance(config: RedisConfig): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService(config);
    }
    return RedisService.instance;
  }

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

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

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

  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error("Redis get error", error);
      throw error;
    }
  }

  public async delete(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error("Redis delete error", error);
      throw error;
    }
  }

  public async mset(keyValuePairs: Record<string, string>): Promise<void> {
    try {
      await this.client.mSet(keyValuePairs);
    } catch (error) {
      console.error("Redis mset error", error);
      throw error;
    }
  }

  public async increment(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error("Redis increment error", error);
      throw error;
    }
  }

  public async mget(...keys: string[]): Promise<Array<string | null>> {
    try {
      return await this.client.mGet(keys);
    } catch (error) {
      Logger.error(`Redis mget error: ${error}`);
      throw error;
    }
  }
}

// Example env.REDIS_URL: "redis://:password@localhost:6379/0"
const redisConfig: RedisConfig = {
  url: env.REDIS_URL,
};

export const redis = RedisService.getInstance(redisConfig);
