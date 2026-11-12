import { Router } from "express";
import {
  getRoot as listProposals,
  patchById as updateProposal,
  postByIdsend as sendProposal,
  postRoot as createProposal,
} from "../controller/proposal.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const proposalRouter = Router();

proposalRouter.get("/", requireAdmin, listProposals);
proposalRouter.post("/", requireAdmin, createProposal);
proposalRouter.patch("/:id", requireAdmin, updateProposal);
proposalRouter.post("/:id/send", requireAdmin, sendProposal);

export default proposalRouter;
