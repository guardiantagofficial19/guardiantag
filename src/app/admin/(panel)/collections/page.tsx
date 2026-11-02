import { sql } from "@/lib/db";
import { createCollectionAction, deleteCollectionAction } from "../../actions";
import ConfirmButton from "@/components/ConfirmButton";
import Link from "next/link";
import { Layers, Plus, ExternalLink, Trash2, FolderPlus } from "lucide-react";

export const dynamic = "force-dynamic";

type SP = { error?: string };

export default async function ShopifyCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const { error } = await searchParams;

  const [collections, productCounts] = await Promise.all([
    sql`SELECT * FROM store_collections ORDER BY sort_order ASC, created_at ASC`,
    sql`SELECT collection_id, count(*)::int as count FROM store_products WHERE collection_id <> '' GROUP BY collection_id`,
  ]);

  const countMap: Record<string, number> = {};
  productCounts.forEach((r) => {
    countMap[r.collection_id] = r.count;
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Collections & Categories</h1>
          <div className="page-subtitle">
            Organize GuardianTag hardware kits into customer collections displayed across the storefront.
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {/* Create Collection Form */}
        <div className="polaris-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: "1px solid var(--shopify-border)",
            }}
          >
            <FolderPlus size={16} color="var(--shopify-green)" />
            <h2 style={{ margin: 0, fontSize: 14 }}>Create Collection</h2>
          </div>

          <form action={createCollectionAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="polaris-form-group">
              <label className="polaris-label">Collection Title</label>
              <input
                name="title"
                placeholder="e.g. Helmet Kits, Adventure Accessories"
                required
                className="polaris-input"
              />
            </div>

            <div className="polaris-form-group">
              <label className="polaris-label">Collection Slug (Optional)</label>
              <input
                name="id"
                placeholder="e.g. helmet-kits (auto-generated if empty)"
                className="polaris-input"
              />
            </div>

            <div className="polaris-form-group">
              <label className="polaris-label">Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Short description shown at top of the collection page…"
                className="polaris-textarea"
              />
            </div>

            <div className="polaris-form-group">
              <label className="polaris-label">Banner Image URL</label>
              <input
                name="image_url"
                placeholder="https://... or /images/..."
                className="polaris-input"
              />
            </div>

            <button type="submit" className="btn-polaris-primary" style={{ marginTop: 6 }}>
              Save Collection
            </button>
          </form>
        </div>

        {/* Existing Collections Table */}
        <div className="polaris-card flush">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--shopify-border)" }}>
            <h2 style={{ margin: 0, fontSize: 14 }}>Active Storefront Collections ({collections.length})</h2>
          </div>

          <table className="polaris-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--shopify-text)" }}>{c.title}</div>
                  </td>
                  <td>
                    <code style={{ fontSize: 12, backgroundColor: "#f1f2f4", padding: "2px 6px", borderRadius: 4 }}>
                      {c.id}
                    </code>
                  </td>
                  <td>
                    <span className="polaris-badge neutral">
                      {countMap[c.id] || 0} products
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--shopify-text-subdued)", maxWidth: 220 }}>
                    {c.description || "—"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <form action={deleteCollectionAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmButton
                        message={`Delete collection "${c.title}"? Products in this collection will not be deleted.`}
                        className="btn-polaris-danger"
                        style={{ padding: "4px 8px", fontSize: 11.5 }}
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
              {!collections.length && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--shopify-text-subdued)" }}>
                    <Layers size={32} style={{ margin: "0 auto 8px", opacity: 0.4, display: "block" }} />
                    No collections created yet.
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
