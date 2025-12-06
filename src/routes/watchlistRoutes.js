import express from "express";
import { addToWatchList, removeFromWatchList, updateWatchList } from "../controllers/watchListController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(addToWatchlistSchema), addToWatchList);

router.put("/:id", updateWatchList);

router.delete("/:id", removeFromWatchList);

export default router;
