import { Router } from "express";
import {
  getAdminoverview as getAdminOverview,
  getAll as listAllRequests,
  getById as getRequest,
  getClientoverview as getClientOverview,
  getMy as listMyRequests,
  getProjects as listRequestProjects,
  patchById as updateRequest,
  postRoot as createRequest,
} from "../controller/request.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const requestRouter = Router();

requestRouter.get("/projects", requireAdmin, listRequestProjects);
requestRouter.post("/", createRequest);
requestRouter.get("/my", listMyRequests);
requestRouter.get("/admin/overview", requireAdmin, getAdminOverview);
requestRouter.get("/client/overview", getClientOverview);
requestRouter.get("/all", requireAdmin, listAllRequests);
requestRouter.patch("/:id", requireAdmin, updateRequest);
requestRouter.get("/:id", getRequest);

export default requestRouter;
