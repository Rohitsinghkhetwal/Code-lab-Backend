import { Router } from "express";
import { createNewRoom, getRoomDetails, joinRoom, leaveRoom } from "../Controllers/Room.controller.js";
import { verifyAuth } from "../Middleware/Auth.middleware.js";

const router = Router();

router.route("/create-room").post( verifyAuth, createNewRoom);
router.route("/join-room/:roomId").post(verifyAuth, joinRoom);
router.route("/leave-room").post(verifyAuth, leaveRoom);
router.route("/getAll-room/:roomId").get(verifyAuth, getRoomDetails)



export default router;