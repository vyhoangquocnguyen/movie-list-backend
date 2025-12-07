/**
 * Validation schema for creating a new movie
 * Validates title, releaseYear, and optional fields
 */
import { z } from "zod";

const addNewMovieSchema = z.object({
  title: z.string().min(1, "Movie Title is required").max(255),
  overview: z.string().min(1).max(255).optional(),
  releaseYear: z.coerce
    .number()
    .int("Release Year must be an integer")
    .min(1900, "Release Year must be between 1900 and 2100")
    .max(2100),
  genre: z.array(z.string()).min(1).max(5).optional(),
  runtime: z
    .number()
    .int("Runtime must be an integer")
    .min(1, "Runtime must be between 1 and 300")
    .max(300, "Runtime must be between 1 and 300")
    .optional(),
  posterUrl: z.string().url().optional(),
});

const updateMovieSchema = addNewMovieSchema.partial();

export { addNewMovieSchema, updateMovieSchema };
