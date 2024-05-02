import express from "express";
import cors from "cors";
import http from "http";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import bodyParser from "body-parser";
//eslint-disable-next-line
//@ts-ignore
import xss from "xss-clean";

import AppError from "./utils/classes/appError";
import globalErrorControl from "./libraries/error/errorControl";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json({ limit: "10kb" }));
app.use(ExpressMongoSanitize());
//eslint-disable-next-line
app.use(xss());

app.use(
  cors({
    //NOTE: allows cross-origin requests to include credentials
    //(such as cookies, HTTP authentication, and client-side SSL certificates).
    credentials: true,
    //NOTE: origin: true (or origin: '*') allows requests from any origin (domain).
    //This essentially opens up your server to cross-origin requests from any site.
    origin:
      process.env.NODE_ENV === "development"
        ? process.env.LOCAL_CLIENT_SERVER
        : [
            `https://${process.env.CLIENT_SERVER}`,
            `https://www.${process.env.CLIENT_SERVER}`,
          ],
  })
);

app.get("/test", (req, res) => {
  res.json({
    status: "success",
    data: {
      message: "Everything is fine",
    },
  });
});

//Add Middlewares

//Add Handlers
app.all("*", (req, res, next) => {
  return next(new AppError(`Can't find  ${req.originalUrl}`, 404));
});

app.use(globalErrorControl);

const expressServer = http.createServer(app);

export default expressServer;
