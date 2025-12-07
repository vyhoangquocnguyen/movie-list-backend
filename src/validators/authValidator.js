/**
 * Validation schema for user registration
 * Validates name, email format, and password strength
 */
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().trim().email("Invalid email format").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export { registerSchema, loginSchema };
