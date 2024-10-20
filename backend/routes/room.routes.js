import { Router } from "express";
import { createNewRoom, joinRoom, leaveRoom } from "../Controllers/Room.controller.js";
import { verifyAuth } from "../Middleware/Auth.middleware.js";

const router = Router();

router.route("/create-room").post( verifyAuth, createNewRoom);
router.route("/join-room").post(verifyAuth, joinRoom);
router.route("/leave-room").post(verifyAuth, leaveRoom);



export default router;