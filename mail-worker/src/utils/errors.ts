import { Logger } from "./logger";

export enum Severity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export enum ErrorType {
  APP = "APP",
  DB_CONNECTION = "DB_CONNECTION",
  DB_QUERY = "DB_QUERY",
  EMAIL_SEND = "EMAIL_SEND",
  TIMEOUT = "TIMEOUT",
  AUTHENTICATION = "AUTHENTICATION",
  VALIDATION = "VALIDATION",
  UNKNOWN = "UNKNOWN",
}

export class AppError extends Error {
  severity: Severity;
  context?: Record<string, any>;

  constructor(
    message: string,
    severity: Severity = Severity.ERROR,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.severity = severity;
    this.context = context;

    Logger.log(message, severity);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseConnectionError extends AppError {
  constructor(
    message: string,
    severity: Severity = Severity.CRITICAL,
    context?: Record<string, any>
  ) {
    super(message, severity, context);
  }
}

export class DatabaseQueryError extends AppError {
  constructor(
    message: string,
    severity: Severity = Severity.ERROR,
    context?: Record<string, any>
  ) {
    super(message, severity, context);
  }
}

export class EmailSendError extends AppError {
  constructor(
    message: string,
    severity: Severity = Severity.ERROR,
    context?: Record<string, any>
  ) {
    super(message, severity, context);
  }
}

export class TimeoutError extends AppError {
  constructor(
    message: string,
    severity: Severity = Severity.CRITICAL,
    context?: Record<string, any>
  ) {
    super(message, severity, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(
    message: string,
    severity: Severity = Severity.WARN,
    context?: Record<string, any>
  ) {
    super(message, severity, context);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    severity: Severity = Severity.WARN,
    context?: Record<string, any>
  ) {
    super(message, severity, context);
  }
}

export class CriticalError extends AppError {
  constructor(
    message: string,
    severity: Severity = Severity.CRITICAL,
    context?: Record<string, any>
  ) {
    super(message, severity, context);
  }
}

// Map Enum to Classes
export const ErrorClassMap = {
  [ErrorType.APP]: AppError,
  [ErrorType.DB_CONNECTION]: DatabaseConnectionError,
  [ErrorType.DB_QUERY]: DatabaseQueryError,
  [ErrorType.EMAIL_SEND]: EmailSendError,
  [ErrorType.TIMEOUT]: TimeoutError,
  [ErrorType.AUTHENTICATION]: AuthenticationError,
  [ErrorType.VALIDATION]: ValidationError,
  [ErrorType.UNKNOWN]: AppError, // Fallback
};

export function extractErrorMessage(error: unknown): {
  message: string;
  trace?: string;
} {
  if (!error) {
    return { message: "An unknown error occurred" };
  }

  // Helper functions for better type safety
  const isObject = (val: unknown): val is Record<string, any> =>
    val !== null && typeof val === "object";
  const isError = (val: unknown): val is Error => val instanceof Error;

  if (isError(error)) {
    return { message: error.message, trace: error.stack };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  if (isObject(error)) {
    // Handle nested errors or custom error objects
    if ("message" in error && typeof error.message === "string") {
      const trace =
        "stack" in error ? String(error.stack) : JSON.stringify(error);
      return { message: error.message, trace };
    }

    // Handle unknown object errors
    return { message: JSON.stringify(error) };
  }

  // Fallback for unhandled cases
  return { message: "An unknown error occurred" };
}

/**
 * Executes a callback inside try-catch and returns [data, error]
 * @param fn - The function to execute
 * @param errorType - The error type to use for wrapping errors (default: APP)
 * @returns [data, error]
 */
export async function tryCatch<T>(
  fn: () => Promise<T> | T,
  errorType: ErrorType = ErrorType.APP
): Promise<[T | null, InstanceType<(typeof ErrorClassMap)[ErrorType]> | null]> {
  try {
    const data = await fn();
    return [data, null];
  } catch (error) {
    const ErrorClass = ErrorClassMap[errorType] || AppError;

    // Return the same error if it's already of the specified type
    if (error instanceof ErrorClass) {
      return [null, error];
    }

    const { message, trace } = extractErrorMessage(error);

    // Wrap unknown errors in the specified class
    const wrappedError = new ErrorClass(message, undefined, {
      originalError: error,
      trace: trace,
    });

    return [null, wrappedError];
  }
}
