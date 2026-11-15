import type { Logger } from "#core/index";

export const consoleLogger: Logger = {
  debug: (...data) => console.log(`[debug]`, ...data),
  info: (...data) => console.log(...data),
  warn: (...data) => console.warn(...data),
  error: (...data) => console.error(...data),
};
