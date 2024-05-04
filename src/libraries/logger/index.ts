import { pino } from "pino";
import { config } from "@/config";
import { ExpressMiddleware } from "@/utils/types";

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    targets: [
      ...(config.isDev
        ? [
            {
              target: "pino-pretty",
              level: config.LOG_LEVEL,
              options: {
                ignore: "pid,hostname",
                colorize: true,
                translateTime: true,
              },
            },
          ]
        : [
            {
              target: "pino/file",
              level: config.LOG_LEVEL,
              options: {},
            },
          ]),
    ],
  },
});

export type Logger = typeof logger;

export const logHandle =
  (id: string): ExpressMiddleware =>
  (req, res, next) => {
    logger.info({
      msg: `handle ${id}`,
      method: req.method,
      path: req.path,
      id: req.id,
    });

    return next();
  };

export const loggerCtx: ExpressMiddleware = function (req, res, next) {
  req.logger = logger.child({
    id: req.id,
  });

  return next();
};
