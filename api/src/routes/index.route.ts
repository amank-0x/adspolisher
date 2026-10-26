import { Router } from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";

const indexRouter: Router = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/auth", authRouter);


export default indexRouter;
