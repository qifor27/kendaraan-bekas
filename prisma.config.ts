import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 moved the connection URL out of schema.prisma.
 * The CLI (migrate / studio / generate) reads it from here; the runtime
 * PrismaClient uses a driver adapter (see src/lib/prisma.ts).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations run over the session-mode pooler (direct, port 5432).
    url: env("DIRECT_URL"),
  },
});
