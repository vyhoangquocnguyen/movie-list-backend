import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client/client.ts";

let prisma;

const connectDB = async () => {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");

    // Create Neon adapter with connection string
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaNeon({ connectionString });

    // Initialize Prisma Client with adapter
    prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (prisma) await prisma.$disconnect();
};

const getPrisma = () => {
  if (!prisma) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return prisma;
};

export { getPrisma, connectDB, disconnectDB };
