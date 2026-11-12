import { Router } from "express";
import {
  getRoot as listApplications,
  patchById as reviewApplication,
  postRoot as submitApplication,
} from "../controller/creator-application.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const creatorApplicationRouter = Router();
const adminCreatorApplicationRouter = Router();

creatorApplicationRouter.post("/", submitApplication);
adminCreatorApplicationRouter.get("/", requireAdmin, listApplications);
adminCreatorApplicationRouter.patch("/:id", requireAdmin, reviewApplication);

export { creatorApplicationRouter, adminCreatorApplicationRouter };
