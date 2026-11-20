import Link from "next/link";
import { TAG_TYPES } from "@/lib/format";
import { sql } from "@/lib/db";
import { createFullProductAction } from "../../../actions";
import { ArrowLeft, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifyNewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const collections = await sql`
    SELECT id, title FROM store_collections ORDER BY sort_order ASC
  `;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/admin/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--shopify-text-subdued)",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} />
          <span>Products</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1>Add New Product</h1>
          <div className="page-subtitle">
            Create a new hardware tag kit for your online store and inventory ledger.
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
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form action={createFullProductAction} encType="multipart/form-data">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          {/* Main Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Details */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 14px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Title &amp; Description
              </h3>

              <div className="polaris-form-group">
                <label className="polaris-label">Product Title *</label>
                <input
                  name="name"
                  placeholder="e.g. GTB Carbon Edition (4-Piece Set)"
                  required
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Subtitle / Key Highlight</label>
                <input
                  name="subtitle"
                  placeholder="e.g. Laser-etched metallic smart emergency tags"
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Customer Description</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Provide full description of features, materials, and emergency utility…"
                  className="polaris-textarea"
                />
              </div>

              <div className="polaris-form-group" style={{ marginBottom: 0 }}>
                <label className="polaris-label">Safety Features (1 per line)</label>
                <textarea
                  name="features"
                  rows={4}
                  placeholder="Instant bystander emergency dialer&#10;Waterproof 3M military adhesive&#10;No mobile app needed"
                  className="polaris-textarea"
                />
              </div>
            </div>

            {/* Media */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 14px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Media
              </h3>

              <div className="polaris-form-group">
                <label className="polaris-label">Upload Product Image</label>
                <input
                  name="image_file"
                  type="file"
                  accept="image/*"
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group" style={{ marginBottom: 0 }}>
                <label className="polaris-label">Or Image URL</label>
                <input
                  name="image_url"
                  placeholder="https://... or /products/..."
                  className="polaris-input"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 14px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Pricing
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div className="polaris-form-group">
                  <label className="polaris-label">Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min={0}
                    defaultValue={499}
                    required
                    className="polaris-input"
                  />
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Compare-at Price (₹)</label>
                  <input
                    name="compare_at_price"
                    type="number"
                    step="0.01"
                    min={0}
                    placeholder="e.g. 999.00"
                    className="polaris-input"
                  />
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Cost per item (₹)</label>
                  <input
                    name="cost_per_item"
                    type="number"
                    step="0.01"
                    min={0}
                    placeholder="e.g. 150.00"
                    className="polaris-input"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 14px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Inventory
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="polaris-form-group">
                  <label className="polaris-label">SKU (Unique SKU Code) *</label>
                  <input
                    name="sku"
                    placeholder="e.g. GTB-KIT-CARBON"
                    style={{ textTransform: "uppercase" }}
                    required
                    className="polaris-input"
                  />
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Hardware Type *</label>
                  <select name="tag_type" className="polaris-select">
                    {TAG_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Opening Available Stock</label>
                  <input
                    name="stock"
                    type="number"
                    min={0}
                    defaultValue={50}
                    className="polaris-input"
                  />
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Low Stock Alert Threshold</label>
                  <input
                    name="low_stock_at"
                    type="number"
                    min={0}
                    defaultValue={10}
                    className="polaris-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Status */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 12px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Status
              </h3>

              <div className="polaris-form-group" style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" name="active" defaultChecked />
                  <span style={{ fontWeight: 600 }}>Active in Online Store</span>
                </label>
              </div>

              <button type="submit" className="btn-polaris-primary" style={{ width: "100%", justifyContent: "center" }}>
                Save &amp; Publish Product
              </button>
            </div>

            {/* Organization */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 12px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Organization
              </h3>

              <div className="polaris-form-group">
                <label className="polaris-label">Collection</label>
                <select name="collection_id" className="polaris-select">
                  <option value="">No Collection</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Category</label>
                <input
                  name="category"
                  placeholder="e.g. Helmet Kits, Decals"
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Vendor</label>
                <input
                  name="vendor"
                  defaultValue="GuardianTag Official"
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group" style={{ marginBottom: 0 }}>
                <label className="polaris-label">Tags (comma separated)</label>
                <input
                  name="tags"
                  placeholder="helmet, biker, waterproof"
                  className="polaris-input"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
