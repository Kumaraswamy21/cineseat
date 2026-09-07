import { copyFileSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./load-env.mjs";

const prismaDir = join(dirname(fileURLToPath(import.meta.url)), "..", "prisma");

loadEnv();

const databaseUrl = process.env.DATABASE_URL ?? "";
const isPostgres =
  databaseUrl.startsWith("postgres://") ||
  databaseUrl.startsWith("postgresql://");

if (!isPostgres) {
  console.log("[prepare-prisma] SQLite mode — keeping prisma/schema.prisma");
  process.exit(0);
}

console.log("[prepare-prisma] PostgreSQL detected — using schema.postgres.prisma");

copyFileSync(
  join(prismaDir, "schema.postgres.prisma"),
  join(prismaDir, "schema.prisma"),
);

const postgresMigrations = join(prismaDir, "migrations-postgres");
if (existsSync(postgresMigrations)) {
  cpSync(postgresMigrations, join(prismaDir, "migrations"), {
    recursive: true,
    force: true,
  });
}
