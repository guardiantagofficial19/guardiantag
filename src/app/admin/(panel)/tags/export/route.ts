import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { tagUrl } from "@/lib/tag-url";
import { TAG_TYPES } from "@/lib/format";

export async function GET(req: Request) {
  await requireAdmin();
  const u = new URL(req.url);
  const t = u.searchParams.get("type");
  const type = t && (TAG_TYPES as readonly string[]).includes(t) ? t : null;
  const status = u.searchParams.get("status");
  const rows = await sql`SELECT qr_id, tag_type, status FROM qr_tags
    WHERE (${type}::text IS NULL OR tag_type = ${type}::text) AND (${status}::text IS NULL OR status = ${status}::text)
    ORDER BY qr_id`;
  const csv = ["qr_id,type,status,url", ...rows.map((r) => `${r.qr_id},${r.tag_type},${r.status},${tagUrl(r.qr_id)}`)].join("\n");
  return new Response(csv, {
    headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="guardiantag-tags-${Date.now()}.csv"` },
  });
}
