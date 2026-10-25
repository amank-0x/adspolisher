import { Request } from "express";
import type { JwtPayload } from "./types/index.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}