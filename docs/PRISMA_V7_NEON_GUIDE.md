# Prisma v7 with Neon Serverless Driver Guide

This guide documents the key changes and setup requirements for using **Prisma v7** with the **Neon serverless driver** in a Node.js/Express backend.

## Key Changes in Prisma v7

### 1. New Generator Name

In Prisma v7, the client generator uses `prisma-client` instead of `prisma-client-js`:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma/client"
}

datasource db {
  provider = "postgresql"
}
```

> **Note:** The `url` is no longer required in the `datasource` block when using adapters. The connection string is provided at runtime.

### 2. Prisma Config File

Prisma v7 uses a `prisma.config.ts` file for configuration:

```typescript
// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### 3. PrismaNeon Adapter Usage

**⚠️ IMPORTANT CHANGE:** The way you initialize `PrismaNeon` has changed!

#### ❌ OLD (Incorrect with Prisma v7)

```javascript
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool); // WRONG!
```

#### ✅ NEW (Correct with Prisma v7)

```javascript
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString }); // Pass object with connectionString
```

The adapter now takes an **object with `connectionString`** property, not a Pool instance.

## Complete Database Configuration Example

```javascript
// src/config/db.js
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client/client.ts";

let prisma;

const connectDB = async () => {
  try {
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
```

## Environment Variables

Ensure your `.env` file contains your Neon connection string:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NODE_ENV="development"
```

### Loading Environment Variables

For ES modules, use one of these approaches:

1. **Node.js `--env-file` flag** (Node.js 20+):

   ```json
   {
     "scripts": {
       "dev": "nodemon --exec \"node --env-file=.env\" src/server.js"
     }
   }
   ```

2. **Import at entry point**:
   ```javascript
   // At the very top of server.js
   import "dotenv/config";
   ```

## Required Dependencies

```json
{
  "dependencies": {
    "@prisma/adapter-neon": "^7.1.0",
    "@prisma/client": "^7.1.0",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "prisma": "^7.1.0"
  }
}
```

## Using Prisma in Controllers

Since the Prisma client is initialized lazily (inside `connectDB`), use the `getPrisma()` function:

```javascript
import { getPrisma } from "../config/db.js";

const getUsers = async (req, res) => {
  const users = await getPrisma().user.findMany();
  res.json(users);
};
```

## Common Errors

### "No database host or connection string was set"

This error occurs when:

1. `PrismaNeon` is initialized with a Pool object instead of `{ connectionString }`
2. Environment variables are not loaded before Prisma initialization

**Solution:** Use `new PrismaNeon({ connectionString })` and ensure `.env` is loaded early.

## References

- [Prisma v7 Documentation](https://www.prisma.io/docs)
- [Prisma Neon Adapter](https://www.prisma.io/docs/orm/overview/databases/neon)
- [Neon Serverless Driver](https://github.com/neondatabase/serverless)
