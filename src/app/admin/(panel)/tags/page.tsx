import { sql } from "@/lib/db";
import { dt, TAG_TYPES } from "@/lib/format";
import { generateTagsAction, tagStatusAction } from "../../actions";
import ConfirmButton from "@/components/ConfirmButton";
import Link from "next/link";
import { QrCode, Download, Plus, CheckCircle2, AlertCircle } from "lucide-react";

type SP = { type?: string; status?: string; q?: string; made?: string; error?: string };

export default async function ShopifyTagsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const type = sp.type && (TAG_TYPES as readonly string[]).includes(sp.type) ? sp.type : null;
  const status = sp.status || null;
  const pat = sp.q ? `%${sp.q}%` : null;

  const [counts, tags] = await Promise.all([
    sql`SELECT tag_type, status, count(*)::int AS n FROM qr_tags GROUP BY 1, 2 ORDER BY 1, 2`,
    sql`SELECT qr_id, tag_type, status, owner_name, vehicle_no, activated_at, created_at FROM qr_tags
        WHERE (${type}::text IS NULL OR tag_type = ${type}::text)
          AND (${status}::text IS NULL OR status = ${status}::text)
          AND (${pat}::text IS NULL OR qr_id ILIKE ${pat}::text OR owner_name ILIKE ${pat}::text OR vehicle_no ILIKE ${pat}::text)
        ORDER BY created_at DESC, qr_id DESC LIMIT 200`,
  ]);

  const exportQs = new URLSearchParams({ ...(type && { type }), ...(status && { status }) }).toString();

  return (
    <>
      <div className="page-header">
        <div>
          <h1>QR Tag Registry</h1>
          <div className="page-subtitle">
            Sequential provisioning, hardware print batches, and emergency tag status controls.
          </div>
        </div>
        <div>
          <a
            href={`/admin/tags/export${exportQs ? `?${exportQs}` : ""}`}
            className="btn-polaris-secondary"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {sp.made && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle2 size={16} />
          <span>{sp.made}</span>
        </div>
      )}

      {sp.error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertCircle size={16} />
          <span>{sp.error}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Batch Generator */}
        <div className="polaris-card">
          <h2 style={{ fontSize: 14, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} color="var(--shopify-green)" />
            <span>Generate New Tag Batch</span>
          </h2>
          <form action={generateTagsAction} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <select name="type" className="polaris-select" style={{ width: "auto" }}>
              {TAG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              name="qty"
              type="number"
              min={1}
              max={500}
              defaultValue={50}
              className="polaris-input"
              style={{ width: 100 }}
            />
            <button type="submit" className="btn-polaris-primary">
              Generate Batch
            </button>
          </form>
          <div className="polaris-help-text" style={{ marginTop: 8 }}>
            IDs auto-increment sequentially (e.g. GTB0001, GTB0002). Newly generated tags start as printed.
          </div>
        </div>

        {/* Status Distribution */}
        <div className="polaris-card">
          <h2 style={{ fontSize: 14, margin: "0 0 10px" }}>Tag Registry Distribution</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {counts.map((c) => (
              <span
                key={c.tag_type + c.status}
                style={{
                  backgroundColor: "#f1f2f4",
                  padding: "5px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <b>{c.tag_type}</b> ({c.status}): {c.n}
              </span>
            ))}
            {!counts.length && <span style={{ color: "var(--shopify-text-subdued)" }}>No tags provisioned yet.</span>}
          </div>
        </div>
      </div>

      {/* Tags Table */}
      <div className="polaris-card flush">
        <div className="filter-bar-container">
          <div className="polaris-tabs">
            <Link href="/admin/tags" className={`polaris-tab ${!type && !status ? "active" : ""}`}>
              All
            </Link>
            {TAG_TYPES.map((t) => (
              <Link
                key={t}
                href={`/admin/tags?type=${t}`}
                className={`polaris-tab ${type === t ? "active" : ""}`}
              >
                {t}
              </Link>
            ))}
            <Link
              href="/admin/tags?status=printed"
              className={`polaris-tab ${status === "printed" ? "active" : ""}`}
            >
              Unactivated
            </Link>
            <Link
              href="/admin/tags?status=disabled"
              className={`polaris-tab ${status === "disabled" ? "active" : ""}`}
            >
              Disabled
            </Link>
          </div>

          <form className="filter-search-form" method="GET">
            <input
              type="text"
              name="q"
              defaultValue={sp.q}
              placeholder="Search by QR ID, owner, vehicle..."
              className="filter-input"
            />
          </form>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="polaris-table">
            <thead>
              <tr>
                <th>QR ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Registered Owner</th>
                <th>Vehicle / Asset</th>
                <th>Activated</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t) => (
                <tr key={t.qr_id}>
                  <td style={{ fontWeight: 700, color: "var(--shopify-green)" }}>{t.qr_id}</td>
                  <td>{t.tag_type}</td>
                  <td>
                    <span className={`polaris-badge ${t.status}`}>{t.status}</span>
                  </td>
                  <td>{t.owner_name ?? "—"}</td>
                  <td>{t.vehicle_no ?? "—"}</td>
                  <td style={{ fontSize: 12, color: "var(--shopify-text-subdued)" }}>
                    {dt(t.activated_at)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      {t.status === "disabled" ? (
                        <form action={tagStatusAction}>
                          <input type="hidden" name="qr_id" value={t.qr_id} />
                          <input type="hidden" name="act" value="enable" />
                          <button
                            type="submit"
                            className="btn-polaris-secondary"
                            style={{ padding: "4px 8px", fontSize: 11.5 }}
                          >
                            Enable
                          </button>
                        </form>
                      ) : (
                        <form action={tagStatusAction}>
                          <input type="hidden" name="qr_id" value={t.qr_id} />
                          <input type="hidden" name="act" value="disable" />
                          <button
                            type="submit"
                            className="btn-polaris-secondary"
                            style={{ padding: "4px 8px", fontSize: 11.5 }}
                          >
                            Disable
                          </button>
                        </form>
                      )}
                      <form action={tagStatusAction}>
                        <input type="hidden" name="qr_id" value={t.qr_id} />
                        <input type="hidden" name="act" value="reset" />
                        <ConfirmButton
                          message={`Reset tag ${t.qr_id}? This deletes the registered owner so the tag can be re-registered.`}
                          className="btn-polaris-danger"
                          style={{ padding: "4px 8px", fontSize: 11.5 }}
                        >
                          Reset
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!tags.length && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px 16px", color: "var(--shopify-text-subdued)" }}>
                    <QrCode size={36} style={{ margin: "0 auto 10px", opacity: 0.4, display: "block" }} />
                    <div style={{ fontSize: 14, fontWeight: 600 }}>No tags match your filter</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
