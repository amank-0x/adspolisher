import { Router } from "express";
import {
  deleteByIddeliverablesByDeliverableId as deleteDeliverable,
  deleteByIdteamByUserId as removeTeamMember,
  getById as getProject,
  getByIdoffers as listProjectOffers,
  getByIdteam as listTeamMembers,
  getCreators as listProjectCreators,
  getRoot as listProjects,
  getRostercreators as listCreatorRoster,
  patchById as updateProject,
  patchByIddeliverablesByDeliverableId as updateDeliverable,
  patchByIdteamByUserId as updateTeamMember,
  patchByProjectIdoffersByOfferId as respondToCreatorCounter,
  postByIddeliverables as createDeliverable,
  postByIdoffers as createProjectOffer,
  postByIdteam as addTeamMember,
  postRostercreators as addCreatorToRoster,
} from "../controller/project.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const projectRouter = Router();

projectRouter.get("/creators", requireAdmin, listProjectCreators);
projectRouter.get("/roster/creators", requireAdmin, listCreatorRoster);
projectRouter.post("/roster/creators", requireAdmin, addCreatorToRoster);

projectRouter.get("/", requireAdmin, listProjects);
projectRouter.get("/:id", requireAdmin, getProject);
projectRouter.patch("/:id", requireAdmin, updateProject);

projectRouter.post("/:id/offers", requireAdmin, createProjectOffer);
projectRouter.get("/:id/offers", requireAdmin, listProjectOffers);
projectRouter.patch("/:projectId/offers/:offerId", requireAdmin, respondToCreatorCounter);

projectRouter.post("/:id/deliverables", requireAdmin, createDeliverable);
projectRouter.patch("/:id/deliverables/:deliverableId", requireAdmin, updateDeliverable);
projectRouter.delete("/:id/deliverables/:deliverableId", requireAdmin, deleteDeliverable);

projectRouter.get("/:id/team", requireAdmin, listTeamMembers);
projectRouter.post("/:id/team", requireAdmin, addTeamMember);
projectRouter.patch("/:id/team/:userId", requireAdmin, updateTeamMember);
projectRouter.delete("/:id/team/:userId", requireAdmin, removeTeamMember);

export default projectRouter;
