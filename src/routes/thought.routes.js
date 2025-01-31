import { Router } from "express";
import { thoughtByPrompt,
         randomThought, 
         subscribingToThought} from "../controllers/randomThought.controller.js";

const router = Router()

router.route("/prompt-thought").post(thoughtByPrompt)
router.route("/thought").post(randomThought)

//email subscribing route
router.route("/subscribe-email").post(subscribingToThought)

export default router;