import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { inr, TAG_TYPES } from "@/lib/format";
import { updateFullProductAction, deleteProductAction } from "../../../actions";
import ConfirmButton from "@/components/ConfirmButton";
import {
  ArrowLeft,
  Tag,
  DollarSign,
  Package,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Trash2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifyEditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ sku: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { sku } = await params;
  const { saved, error } = await searchParams;

  const [rows, collections] = await Promise.all([
    sql`SELECT * FROM store_products WHERE sku = ${decodeURIComponent(sku)} LIMIT 1`,
    sql`SELECT id, title FROM store_collections ORDER BY sort_order ASC`,
  ]);

  const product = rows[0];
  if (!product) notFound();

  const priceRupees = (product.price_paise || 0) / 100;
  const compareAtRupees = (product.compare_at_price_paise || 0) / 100;
  const costRupees = (product.cost_per_item_paise || 0) / 100;

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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1>{product.name}</h1>
            <span className={`polaris-badge ${product.active ? "active" : "draft"}`}>
              {product.active ? "Active" : "Draft"}
            </span>
          </div>
          <div className="page-subtitle">SKU: {product.sku}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-polaris-secondary"
          >
            <span>View in Store</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {saved && (
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
          <span>Product updated successfully! Changes are live on your customer storefront.</span>
        </div>
      )}

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

      <form action={updateFullProductAction}>
        <input type="hidden" name="sku" value={product.sku} />

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          {/* Main Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Title & Description */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 14px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Product Details
              </h3>

              <div className="polaris-form-group">
                <label className="polaris-label">Title</label>
                <input
                  name="name"
                  defaultValue={product.name}
                  required
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Subtitle / Highlight Tagline</label>
                <input
                  name="subtitle"
                  defaultValue={product.subtitle || ""}
                  placeholder="e.g. 4-Piece Ultra-Shield Kit for Bikers"
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={product.description || ""}
                  placeholder="Full customer-facing product description…"
                  className="polaris-textarea"
                />
              </div>

              <div className="polaris-form-group" style={{ marginBottom: 0 }}>
                <label className="polaris-label">Key Safety Features (1 per line)</label>
                <textarea
                  name="features"
                  rows={4}
                  defaultValue={product.features || ""}
                  placeholder="Instant bystander emergency scan&#10;Zero app installation required&#10;Waterproof 3M military adhesive"
                  className="polaris-textarea"
                />
              </div>
            </div>

            {/* Media Upload */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 14px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Media & Imagery
              </h3>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 14 }}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: 90,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid var(--shopify-border)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 8,
                      border: "1px dashed var(--shopify-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--shopify-text-subdued)",
                    }}
                  >
                    <ImageIcon size={24} />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div className="polaris-form-group" style={{ marginBottom: 10 }}>
                    <label className="polaris-label">Upload New Image from Device</label>
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
                      defaultValue={product.image_url || ""}
                      placeholder="https://... or /products/..."
                      className="polaris-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shopify Pricing Card */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 14px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Pricing
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div className="polaris-form-group">
                  <label className="polaris-label">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min={0}
                    defaultValue={priceRupees}
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
                    defaultValue={compareAtRupees || ""}
                    placeholder="e.g. 999.00"
                    className="polaris-input"
                  />
                  <div className="polaris-help-text">Strikethrough original price</div>
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Cost per item (₹)</label>
                  <input
                    name="cost_per_item"
                    type="number"
                    step="0.01"
                    min={0}
                    defaultValue={costRupees || ""}
                    placeholder="e.g. 120.00"
                    className="polaris-input"
                  />
                  <div className="polaris-help-text">Customers won't see this</div>
                </div>
              </div>
            </div>

            {/* Inventory Card */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 14px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Inventory & SKU
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="polaris-form-group">
                  <label className="polaris-label">SKU (Stock Keeping Unit)</label>
                  <input
                    readOnly
                    defaultValue={product.sku}
                    className="polaris-input"
                    style={{ backgroundColor: "#f1f2f4" }}
                  />
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Barcode / QR Identifier</label>
                  <input
                    name="barcode"
                    defaultValue={product.barcode || ""}
                    placeholder="e.g. 890123456789"
                    className="polaris-input"
                  />
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Low Stock Alert Threshold</label>
                  <input
                    name="low_stock_at"
                    type="number"
                    min={0}
                    defaultValue={product.low_stock_at}
                    className="polaris-input"
                  />
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Hardware Type</label>
                  <select name="tag_type" defaultValue={product.tag_type} className="polaris-select">
                    {TAG_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Status Card */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 12px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Product Status
              </h3>

              <div className="polaris-form-group" style={{ marginBottom: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={product.active}
                  />
                  <span style={{ fontWeight: 600 }}>Active in Online Store</span>
                </label>
                <div className="polaris-help-text" style={{ marginTop: 4 }}>
                  When unchecked, the product is saved as Draft and hidden from customers.
                </div>
              </div>

              <button type="submit" className="btn-polaris-primary" style={{ width: "100%", justifyContent: "center" }}>
                Save Changes
              </button>
            </div>

            {/* Organization Card */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 12px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Product Organization
              </h3>

              <div className="polaris-form-group">
                <label className="polaris-label">Collection</label>
                <select name="collection_id" defaultValue={product.collection_id || ""} className="polaris-select">
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
                  defaultValue={product.category || ""}
                  placeholder="e.g. Safety Decals, Wearables"
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Vendor / Manufacturer</label>
                <input
                  name="vendor"
                  defaultValue={product.vendor || "GuardianTag Official"}
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group" style={{ marginBottom: 0 }}>
                <label className="polaris-label">Tags (comma separated)</label>
                <input
                  name="tags"
                  defaultValue={product.tags || ""}
                  placeholder="biker, helmet, water-resistant"
                  className="polaris-input"
                />
              </div>
            </div>

            {/* Google Search Engine Preview */}
            <div className="polaris-card">
              <h3 style={{ margin: "0 0 10px", borderBottom: "1px solid var(--shopify-border)", paddingBottom: 8 }}>
                Search Engine Listing
              </h3>
              <div style={{ fontSize: 11, color: "#1a0dab", fontWeight: 500, lineHeight: 1.3 }}>
                {product.name} — GuardianTag Official Store
              </div>
              <div style={{ fontSize: 10, color: "#006621", marginTop: 2 }}>
                https://guardiantag.vercel.app/products/{product.sku.toLowerCase()}
              </div>
              <div style={{ fontSize: 11, color: "var(--shopify-text-subdued)", marginTop: 4, lineHeight: 1.3 }}>
                {product.description ? product.description.slice(0, 100) + "…" : "Official emergency smart QR tag for bikers and travelers."}
              </div>
            </div>

            {/* Delete Product */}
            <div className="polaris-card">
              <ConfirmButton
                message={`Are you sure you want to deactivate ${product.name}?`}
                className="btn-polaris-danger"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Archive Product
              </ConfirmButton>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
