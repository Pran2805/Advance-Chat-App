import pinoHttp from "pino-http";
import { logger } from "../utils/logger.ts";

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (_, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});
