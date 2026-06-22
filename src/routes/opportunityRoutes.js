import { Router } from "express";
import {
  getOpportunities,
  createOpportunity,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.route("/").get(getOpportunities).post(createOpportunity);
router.route("/:id").get(getOpportunityById).put(updateOpportunity).delete(deleteOpportunity);

export default router;
