import { Router } from "express";
import { getProfile, updateProfile, searchUserController } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

// this protectes every registered route
router.use(requireAuth);

router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.get("/search", searchUserController);

export default router;