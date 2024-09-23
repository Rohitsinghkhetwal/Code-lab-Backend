import { Router } from "express";
import {
  Login,
  Logout,
  Signup,
  uploadImage,
  VerifyEmail,
} from "../Controllers/User.Controller.js";
import { verifyAuth } from "../Middleware/Auth.middleware.js";
import { upload } from "../Middleware/Multer.js";
const router = Router();
router.route("/sign-up").post(Signup);
router.route("/login").post(Login);
//router.route("/verify-email").post(VerifyEmail);
router.route("/log-out").post(verifyAuth, Logout);
router.route("/upload-image").patch(verifyAuth,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    }
  ]),
  uploadImage
 );

export default router;