import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "Unauthorised"
        })
    }

    try {
        const decode = jwt.verify(token, process.env.USER_SECRET!) as JwtPayload ;
        req.user = {
            id: decode.id,
            email: decode.email,
        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
}