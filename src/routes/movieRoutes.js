import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addNewMovie, deleteMovie, getAllMovies, updateMovie } from "../controllers/moviesController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addNewMovieSchema, updateMovieSchema } from "../validators/movieValidator.js";

const router = express.Router();

router.get("/", getAllMovies);

router.use(authMiddleware);

router.post("/", validateRequest(addNewMovieSchema), addNewMovie);

router.put("/:id", validateRequest(updateMovieSchema), updateMovie);

router.delete("/:id", deleteMovie);

export default router;
