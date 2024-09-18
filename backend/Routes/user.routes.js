import {Router} from "express"
import { Signup } from "../Controllers/User.Controller.js";
const router = Router();
router.route("/sign-up").post(Signup)


export default router;