import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { Router } from "express";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../types/index.js";
import { assignToken } from "../utils/assignToken.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter: Router = Router();

userRouter.post("/signup", async (req, res) => {
    const { success, data } = registerSchema.safeParse(req.body);
    if(!success) {
        return res.status(400).json({
            message: "Invalid input"
        })
    }

    try {
        const findUser = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        })

        if(findUser) {
            return res.status(400).json({
                message: "User already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prismaClient.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            }
        })

        assignToken(res, user.id, user.email, process.env.USER_SECRET!);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    const { success, data } = loginSchema.safeParse(req.body);
    if(!success) {
        return res.status(400).json({
            message: "Invalid input"
        })
    }

    try {
        const findUser = await prismaClient.user.findUnique({
            where: {
                email: data.email,
            }
        })
        if(!findUser) {
            return res.status(400).json({
                message: "User doesn't exits"
            })
        }

        const isValid = await bcrypt.compare(data.password, findUser.password);
        if(!isValid) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        assignToken(res, findUser.id, findUser.email, process.env.USER_SECRET!);

        res.status(200).json({
            message: "Successfully logged in",
            user: {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email
            }
        })
        
    } catch (error) {
        console.log("Error in signin endpoint: ", error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

userRouter.get("/", authMiddleware, async (req, res) => {
    const userId = req.user?.id;
    
    if(!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const user = await withDatabaseRetry(() => prismaClient.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        }))

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in user profile endpoint: ", error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

userRouter.post("/logout", authMiddleware, async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log("Error in logout endpoint: ", error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})


export default userRouter;
