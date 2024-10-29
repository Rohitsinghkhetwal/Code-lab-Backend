import { Router } from "express";
import { Validator } from "../Middleware/Validator.js";

const router = Router();

router.route("/validate").post(Validator);

export default router;