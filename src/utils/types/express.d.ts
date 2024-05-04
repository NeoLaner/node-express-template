import { Logger } from "@/libraries/logger";
import "express";

declare global {
  namespace Express {
    interface Request {
      id: string;
      logger: Logger;
    }
  }
}
