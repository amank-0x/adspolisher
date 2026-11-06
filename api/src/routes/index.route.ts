import { Router } from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import requestRouter from "./request.route.js";
import proposalRouter from "./proposal.route.js";
import creatorApplicationRouter, { adminCreatorApplicationRouter } from "./creator-application.route.js";

const indexRouter: Router = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/auth", authRouter);
indexRouter.use("/requests", requestRouter);
indexRouter.use("/admin/proposals", proposalRouter);
indexRouter.use("/creator-applications", creatorApplicationRouter);
indexRouter.use("/admin/creator-applications", adminCreatorApplicationRouter);

export default indexRouter;
