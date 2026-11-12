import { Router } from "express";
import { getRoot, postLogout, postSignin, postSignup } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post("/signup", postSignup);
userRouter.post("/signin", postSignin);
userRouter.get("/", authMiddleware, getRoot);
userRouter.post("/logout", authMiddleware, postLogout);

export default userRouter;
