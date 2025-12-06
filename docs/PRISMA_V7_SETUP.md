# Prisma v7 Setup for JavaScript Projects

## The Issue

When running `node src/server.js`, encountered multiple errors:

- `SyntaxError: Named export 'PrismaClient' not found`
- `Cannot find module` errors
- `PrismaClientConstructorValidationError`

## Root Cause

**Prisma v7 introduced breaking changes:**

1. Requires `provider = "prisma-client"` instead of `"prisma-client-js"`
2. Generates TypeScript files (`.ts`) instead of JavaScript
3. **Requires database adapters** - cannot connect to databases directly anymore
4. The old `@prisma/client` import pattern doesn't work with custom output paths

## Solution

### 1. Install Required Packages

```bash
npm install @prisma/adapter-neon @neondatabase/serverless
```

### 2. Update Schema Configuration

**File:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma/client"
}

datasource db {
  provider = "postgresql"
}
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Update Database Connection File

**File:** `src/config/db.js`

```javascript
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client/client.ts";

// Create Neon connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
  await pool.end();
};

export { prisma, connectDB, disconnectDB };
```

### 5. Environment Variables

**File:** `.env`

```env
DATABASE_URL="postgresql://user:password@host:5432/database_name"
NODE_ENV="development"
```

## Key Points

✅ **Prisma v7 generates TypeScript files** even for JavaScript projects  
✅ **Node.js can import `.ts` files** directly when using ES modules (`"type": "module"`)  
✅ **Must use a database adapter** - direct connections are no longer supported  
✅ **Import from custom output path** when using custom `output` in schema  
✅ **Adapter wraps the database driver** and passes it to PrismaClient constructor

## Alternative Adapters

Depending on your database and hosting environment:

- **PostgreSQL (Neon Serverless):** `@prisma/adapter-neon` + `@neondatabase/serverless`
- **PostgreSQL (node-postgres):** `@prisma/adapter-pg` + `pg`
- **MySQL:** `@prisma/adapter-mysql` + `mysql2`
- **SQLite:** `@prisma/adapter-libsql` + `@libsql/client`

## References

- [Prisma v7 Adapter Documentation](https://www.prisma.io/docs/orm/overview/databases/database-drivers)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)
