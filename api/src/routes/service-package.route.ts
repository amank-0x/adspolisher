import { Router } from "express";
import {
  deleteById as deletePackage,
  deleteById2 as deleteService,
  getById as getPackage,
  getRoot as listPackages,
  getRoot2 as listServices,
  patchById as updatePackage,
  patchById2 as updateService,
  postRoot as createPackage,
  postRoot2 as createService,
  postSeedDefaults as seedDefaultPackages,
} from "../controller/service-package.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const packageRouter = Router();
const serviceRouter = Router();

packageRouter.get("/", listPackages);
packageRouter.get("/:id", getPackage);
packageRouter.post("/", requireAdmin, createPackage);
packageRouter.patch("/:id", requireAdmin, updatePackage);
packageRouter.delete("/:id", requireAdmin, deletePackage);
packageRouter.post("/seed-defaults", requireAdmin, seedDefaultPackages);

serviceRouter.get("/", listServices);
serviceRouter.post("/", requireAdmin, createService);
serviceRouter.patch("/:id", requireAdmin, updateService);
serviceRouter.delete("/:id", requireAdmin, deleteService);

export { packageRouter, serviceRouter };
