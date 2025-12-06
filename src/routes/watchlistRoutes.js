import express from "express";
import { addToWatchList, removeFromWatchList, updateWatchList } from "../controllers/watchListController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWatchList);

router.put("/:id", updateWatchList);

router.delete("/:id", removeFromWatchList);

export default router;
