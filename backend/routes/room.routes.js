import { Router } from "express";
import { createRoomId } from "../Controllers/Room.controller.js";
import { verifyAuth } from "../Middleware/Auth.middleware.js";

const router = Router();

router.route("/create-room").post(verifyAuth, createRoomId)


export default router;