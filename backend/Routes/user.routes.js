import {Router} from "express"
import { Login, Logout, Signup, VerifyEmail } from "../Controllers/User.Controller.js";
import { verifyAuth } from "../Middleware/Auth.middleware.js";
const router = Router();
router.route("/sign-up").post(Signup)
router.route("/login").post(Login);
router.route("/verify-email").post(VerifyEmail)
router.route("/log-out").post(verifyAuth, Logout)

export default router;