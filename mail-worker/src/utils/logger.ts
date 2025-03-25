import pino from "pino";
import { Severity } from "./errors.js";
import { env } from "./env.js";

const logger = pino({
  level: env.DEBUG ? "debug" : "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss Z",
          ignore: "pid,hostname,context",
        },
        level: env.DEBUG ? "debug" : "info",
      },
      {
        target: "pino-roll",
        options: {
          file: "./logs/logs.log",
          mkdir: true,
          size: "10m",
          limit: { count: 5 },
        },
      },
    ],
  },
});

export class Logger {
  static error(message: string, context: Record<string, any> = {}) {
    logger.error({ context }, message);
  }

  static info(message: string, context: Record<string, any> = {}) {
    logger.info({ context }, message);
  }

  static debug(message: string, context: Record<string, any> = {}) {
    logger.debug({ context }, message);
  }

  static warn(message: string, context: Record<string, any> = {}) {
    logger.warn({ context }, message);
  }

  static log(
    message: string,
    severity: Severity,
    context: Record<string, any> = {}
  ) {
    switch (severity) {
      case Severity.INFO:
        logger.info({ context }, message);
        break;
      case Severity.WARN:
        logger.warn({ context }, message);
        break;
      case Severity.ERROR:
        logger.error({ context }, message);
        break;
      case Severity.DEBUG:
        logger.debug({ context }, message);
        break;
      default:
        logger.info({ context }, message);
        break;
    }
  }
}
