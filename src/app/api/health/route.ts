import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neonClient';

/**
 * Deployment health check.
 * Reports whether the database is configured and reachable — never exposes
 * credentials, only the Neon endpoint name so you can confirm the right DB.
 */
export async function GET(request: Request) {
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || '';
  let endpoint: string | null = null;
  try {
    endpoint = url ? new URL(url).hostname.split('.')[0] : null;
  } catch {
    endpoint = 'invalid-url';
  }

  const result: Record<string, unknown> = {
    checkedAt: new Date().toISOString(),
    path: new URL(request.url).pathname,
    databaseUrlSet: Boolean(url),
    neonEndpoint: endpoint,
    twilioConfigured: Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      (process.env.TWILIO_PROXY_NUMBER || process.env.TWILIO_PHONE_NUMBER)
    ),
  };

  const sql = getNeonSql();
  if (!sql) {
    result.database = 'not-configured';
    return NextResponse.json(result, { status: 503 });
  }

  try {
    const rows = await (sql as any).query(
      `SELECT
         (SELECT COUNT(*)::int FROM bikers) AS bikers,
         (SELECT COUNT(*)::int FROM kids) AS kids,
         (SELECT COUNT(*)::int FROM travellers) AS travellers,
         (SELECT COUNT(*)::int FROM universals) AS universals,
         (SELECT COUNT(*)::int FROM qr_tags) AS qr_tags`
    );
    result.database = 'connected';
    result.counts = rows[0];
    return NextResponse.json(result);
  } catch (err: any) {
    result.database = 'error';
    result.error = err?.message || 'query failed';
    return NextResponse.json(result, { status: 503 });
  }
}
