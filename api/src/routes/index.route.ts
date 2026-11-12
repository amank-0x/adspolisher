import { Router } from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import requestRouter from "./request.route.js";
import proposalRouter from "./proposal.route.js";
import projectRouter from "./project.route.js";
import portfolioRouter from "./portfolio.route.js";
import { creatorApplicationRouter, adminCreatorApplicationRouter } from "./creator-application.route.js";
import { serviceRouter, packageRouter } from "./service-package.route.js";
import creatorRouter from "./creator.route.js";

const indexRouter: Router = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/auth", authRouter);
indexRouter.use("/requests", requestRouter);
indexRouter.use("/projects", projectRouter);
indexRouter.use("/admin/projects", projectRouter);
indexRouter.use("/admin/portfolio", portfolioRouter);
indexRouter.use("/admin/proposals", proposalRouter);
indexRouter.use("/creator-applications", creatorApplicationRouter);
indexRouter.use("/admin/creator-applications", adminCreatorApplicationRouter);
indexRouter.use("/services", serviceRouter);
indexRouter.use("/admin/services", serviceRouter);
indexRouter.use("/packages", packageRouter);
indexRouter.use("/admin/packages", packageRouter);
indexRouter.use("/creator", creatorRouter);

export default indexRouter;
