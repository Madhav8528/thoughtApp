import { Router } from "express";
import { thoughtByPrompt,
         randomThought } from "../controllers/randomThought.controller.js";

const router = Router()

router.route("/prompt-thought").post(thoughtByPrompt)
router.route("/thought").post(randomThought)

export default router;