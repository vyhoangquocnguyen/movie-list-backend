# API Development Guide

This guide explains how to create routers, validators, and middleware for this Express.js project.

---

## Project Structure

```
src/
├── routes/           # Route definitions
├── controllers/      # Business logic
├── middleware/       # Custom middleware
├── validators/       # Zod validation schemas
└── server.js         # Main application entry
```

---

## 1. Creating a Router

Routers define the API endpoints and connect them to controllers.

### Step 1: Create the route file

Create a new file in `src/routes/` (e.g., `exampleRoutes.js`):

```javascript
import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/exampleController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createExampleSchema } from "../validators/exampleValidators.js";

const router = express.Router();

// Apply auth middleware to all routes (optional)
router.use(authMiddleware);

// Define routes
router.get("/", getAll); // GET /example
router.get("/:id", getOne); // GET /example/:id
router.post("/", validateRequest(createExampleSchema), create); // POST /example
router.put("/:id", update); // PUT /example/:id
router.delete("/:id", remove); // DELETE /example/:id

export default router;
```

### Step 2: Register the route in `server.js`

```javascript
import exampleRoutes from "./routes/exampleRoutes.js";

// Add this line with other routes
app.use("/example", exampleRoutes);
```

---

## 2. Creating Validators

Validators use [Zod](https://zod.dev/) to validate request data.

### Step 1: Create a validator file

Create a new file in `src/validators/` (e.g., `exampleValidators.js`):

```javascript
import { z } from "zod";

// Schema for creating a new resource
const createExampleSchema = z.object({
  // Required string field
  name: z.string().min(1, "Name is required"),

  // Required UUID field
  userId: z.string().uuid("Must be a valid UUID"),

  // Optional enum field
  status: z
    .enum(["ACTIVE", "INACTIVE"], {
      errorMap: () => ({ message: "Status must be ACTIVE or INACTIVE" }),
    })
    .optional(),

  // Optional number with range validation
  priority: z.coerce
    .number()
    .int("Priority must be an integer")
    .min(1, "Priority must be at least 1")
    .max(10, "Priority cannot exceed 10")
    .optional(),

  // Optional string
  description: z.string().optional(),

  // Optional email
  email: z.string().email("Invalid email format").optional(),
});

// Schema for updating (all fields optional)
const updateExampleSchema = createExampleSchema.partial();

export { createExampleSchema, updateExampleSchema };
```

### Common Zod Validations

| Type          | Example                                         |
| ------------- | ----------------------------------------------- |
| String        | `z.string().min(1).max(100)`                    |
| Number        | `z.number().int().min(0).max(100)`              |
| Coerce Number | `z.coerce.number()` (converts string to number) |
| UUID          | `z.string().uuid()`                             |
| Email         | `z.string().email()`                            |
| URL           | `z.string().url()`                              |
| Enum          | `z.enum(["A", "B", "C"])`                       |
| Boolean       | `z.boolean()`                                   |
| Array         | `z.array(z.string())`                           |
| Optional      | `.optional()`                                   |
| Default       | `.default("value")`                             |

---

## 3. Creating Middleware

Middleware functions process requests before they reach controllers.

### Validation Middleware (already exists)

The project has a reusable `validateRequest` middleware in `src/middleware/validateRequest.js`:

```javascript
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatted = result.error.format();
      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((error) => error._errors)
        .flat();
      const error = flatErrors.join(", ");
      return res.status(400).json({ message: error });
    }
    next();
  };
};
```

**Usage in routes:**

```javascript
router.post("/", validateRequest(yourSchema), yourController);
```

### Authentication Middleware (already exists)

The `authMiddleware` in `src/middleware/authMiddleware.js` protects routes by:

1. Reading JWT from `Authorization` header or cookies
2. Verifying the token
3. Attaching the user to `req.user`

**Usage:**

```javascript
// Protect all routes in a router
router.use(authMiddleware);

// Or protect specific routes
router.get("/protected", authMiddleware, protectedController);
```

### Creating Custom Middleware

```javascript
// src/middleware/customMiddleware.js

const customMiddleware = (req, res, next) => {
  // Do something with the request
  console.log(`${req.method} ${req.path}`);

  // Optionally modify req or res
  req.customData = "some value";

  // Call next() to continue to the next middleware/controller
  next();

  // Or return an error response
  // return res.status(403).json({ error: "Forbidden" });
};

export default customMiddleware;
```

---

## 4. Complete Example: Adding a "Reviews" Feature

### Step 1: Create the validator

```javascript
// src/validators/reviewValidators.js
import { z } from "zod";

const createReviewSchema = z.object({
  movieId: z.string().uuid("Invalid movie ID"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

export { createReviewSchema };
```

### Step 2: Create the controller

```javascript
// src/controllers/reviewController.js
import { getPrisma } from "../config/db.js";

export const createReview = async (req, res) => {
  const prisma = getPrisma();
  try {
    const review = await prisma.review.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Step 3: Create the router

```javascript
// src/routes/reviewRoutes.js
import express from "express";
import { createReview } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createReviewSchema } from "../validators/reviewValidators.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", validateRequest(createReviewSchema), createReview);

export default router;
```

### Step 4: Register in server.js

```javascript
import reviewRoutes from "./routes/reviewRoutes.js";
app.use("/reviews", reviewRoutes);
```

---

## Quick Reference

| Action           | Location          | Pattern                    |
| ---------------- | ----------------- | -------------------------- |
| Add new endpoint | `src/routes/`     | Create/modify route file   |
| Add validation   | `src/validators/` | Create Zod schema          |
| Add middleware   | `src/middleware/` | Export middleware function |
| Register routes  | `src/server.js`   | `app.use("/path", router)` |
