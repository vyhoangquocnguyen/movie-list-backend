import "dotenv/config";

import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoute.js";

connectDB();

const app = express();

// Body Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API ROUTE
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

const PORT = 5001;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.log("Uncaught Exception", err);
  await disconnectDB();
  process.exit(1);
});

//Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
