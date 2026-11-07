import type { Logger } from "@figur/core";

export const consoleLogger: Logger = {
  info: (message) => console.log(message),
  warn: (message) => console.warn(message),
  error: (message) => console.error(message),
};

export function prefixed(logger: Logger, prefix: string): Logger {
  return {
    info: (message) => logger.info(`[${prefix}] ${message}`),
    warn: (message) => logger.warn(`[${prefix}] ${message}`),
    error: (message) => logger.error(`[${prefix}] ${message}`),
  };
}
