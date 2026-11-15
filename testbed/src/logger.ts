import type { Logger } from "@figur/core";

export const consoleLogger: Logger = {
  debug: () => {
    /* debug logsnot enabled */
  },
  info: (...data) => console.log(...data),
  warn: (...data) => console.warn(...data),
  error: (...data) => console.error(...data),
};

export function prefixed(logger: Logger, prefix: string): Logger {
  return {
    debug: (...data) => logger.info(`[${prefix}]`, ...data),
    info: (...data) => logger.info(`[${prefix}]`, ...data),
    warn: (...data) => logger.warn(`[${prefix}]`, ...data),
    error: (...data) => logger.error(`[${prefix}]`, ...data),
  };
}
