import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./load-env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const prismaCli = join(root, "node_modules/prisma-orm/build/index.js");

loadEnv();

const databaseUrl = process.env.DATABASE_URL ?? "";
const isPostgres =
  databaseUrl.startsWith("postgres://") ||
  databaseUrl.startsWith("postgresql://");

if (!isPostgres) {
  console.log("[prisma-deploy] SQLite mode — skipping migrate deploy");
  process.exit(0);
}

console.log("[prisma-deploy] Applying PostgreSQL migrations…");

const result = spawnSync("node", [prismaCli, "migrate", "deploy"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
