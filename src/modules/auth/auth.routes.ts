import { Router } from "express";
import { register, login, logout, getMe} from "./auth.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", requireAuth, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

export default router;