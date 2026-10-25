import type { NeonQueryFunction } from "@neondatabase/serverless";
import { getNeonSql } from "@/lib/neonClient";

// Store manager database handle. Reuses the site's existing Neon connection
// (DATABASE_URL, NEON_DATABASE_URL or POSTGRES_URL). The connection is opened on
// first use, not at import time, so `next build` works without the env var.
function client(): NeonQueryFunction<false, false> {
  const sql = getNeonSql();
  if (!sql) throw new Error("Database not configured: set DATABASE_URL in Vercel.");
  return sql;
}

export const sql = new Proxy((() => {}) as unknown as NeonQueryFunction<false, false>, {
  apply: (_t, _this, args) => (client() as unknown as (...a: unknown[]) => unknown)(...args),
  get: (_t, prop) => {
    const value = (client() as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client()) : value;
  },
});
