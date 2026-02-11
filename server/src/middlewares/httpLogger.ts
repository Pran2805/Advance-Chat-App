import pinoHttp from "pino-http";
import { logger } from "../utils/logger.ts";
import os from "os";

const PLATFORM = `${os.platform()}/${process.version}`;


export const httpLogger = pinoHttp({
  logger,
  autoLogging: false,

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} ${res.statusCode} `;
  },

  customErrorMessage(req, res, err) {
    return ` ${req.method} ${req.url} ${res.statusCode}  ${err.message}`;
  },
});
