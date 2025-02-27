import express from "express";
import { aiMove } from "../controllers/aiController.js";

const router = express.Router();

router.get("/ai/:level", aiMove);

export default router;
