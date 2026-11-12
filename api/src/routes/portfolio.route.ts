import { Router } from "express";
import {
  getCreators as listCreators,
  getCreatorsById as getCreatorPortfolio,
} from "../controller/portfolio.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const portfolioRouter = Router();

portfolioRouter.get("/creators", requireAdmin, listCreators);
portfolioRouter.get("/creators/:id", requireAdmin, getCreatorPortfolio);

export default portfolioRouter;
