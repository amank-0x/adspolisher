import type { Response } from "express";
import jwt from "jsonwebtoken";


export const assignToken = (res: Response, id: string, email: string, secret: string) => {
    const token = jwt.sign({id, email}, secret);

    res.cookie("token", token, {
        httpOnly: true,
        //secure: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })

}