import { Router } from "express";
import {
  getOffers,
  getPortfolio,
  getProfile,
  getEarnings,
  getProject,
  getProjects,
  getTeams,
  patchOffersByIdrespond as respondToOffer,
  patchProfile,
  patchSettingsavatar as updateAvatar,
  patchSettingsnotifications as updateNotifications,
  patchSettingspassword as changePassword,
} from "../controller/creator.controller.js";
import { requireCreator } from "../middleware/requireCreator.js";

const creatorRouter = Router();

creatorRouter.get("/offers", requireCreator, getOffers);
creatorRouter.patch("/offers/:id/respond", requireCreator, respondToOffer);
creatorRouter.get("/earnings", requireCreator, getEarnings);
creatorRouter.get("/teams", requireCreator, getTeams);
creatorRouter.get("/projects", requireCreator, getProjects);
creatorRouter.get("/projects/:projectId", requireCreator, getProject);
creatorRouter.get("/portfolio", requireCreator, getPortfolio);
creatorRouter.get("/profile", requireCreator, getProfile);
creatorRouter.patch("/profile", requireCreator, patchProfile);
creatorRouter.patch("/settings/password", requireCreator, changePassword);
creatorRouter.patch("/settings/avatar", requireCreator, updateAvatar);
creatorRouter.patch("/settings/notifications", requireCreator, updateNotifications);

export default creatorRouter;
