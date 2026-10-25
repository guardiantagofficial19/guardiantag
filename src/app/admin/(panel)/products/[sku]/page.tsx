import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { inr, TAG_TYPES } from "@/lib/format";
import { updateFullProductAction, deleteProductAction } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ sku: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { sku } = await params;
  const { saved, error } = await searchParams;

  const rows = await sql`
    SELECT * FROM store_products WHERE sku = ${decodeURIComponent(sku)} LIMIT 1
  `;
  const product = rows[0];

  if (!product) notFound();

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/products" className="muted" style={{ fontSize: 13 }}>
          ← Back to Products Catalog
        </Link>
        <div className="row" style={{ marginTop: 8 }}>
          <h1>
            Edit Product: <span style={{ color: "#facc15" }}>{product.name}</span>
          </h1>
          <span className="pill" style={{ fontSize: 13, background: "#222" }}>
            SKU: {product.sku}
          </span>
        </div>
      </div>

      {saved && (
        <div
          className="card ok"
          style={{
            background: "rgba(74, 222, 128, 0.1)",
            border: "1px solid #4ade80",
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          ✓ Product details, pricing, and images updated successfully!
        </div>
      )}

      {error && (
        <div
          className="card err"
          style={{
            background: "rgba(248, 113, 113, 0.1)",
            border: "1px solid #f87171",
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <div className="grid2" style={{ alignItems: "start" }}>
        {/* Left Column: Product Details Form */}
        <section className="card">
          <h2>Product Information</h2>

          <form action={updateFullProductAction} className="form" encType="multipart/form-data">
            <input type="hidden" name="sku" value={product.sku} />

            <div className="cols">
              <label>
                Product Name *
                <input name="name" defaultValue={product.name} required />
              </label>

              <label>
                Tag Type *
                <select name="tag_type" defaultValue={product.tag_type}>
                  {TAG_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  <option value="CUSTOM">CUSTOM</option>
                </select>
              </label>
            </div>

            <div className="cols">
              <label>
                Price in INR (₹) *
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={product.price_paise / 100}
                  required
                />
              </label>

              <label>
                Low-Stock Alert Level
                <input
                  name="low_stock_at"
                  type="number"
                  min={0}
                  defaultValue={product.low_stock_at}
                />
              </label>
            </div>

            <label>
              Subtitle (Tagline)
              <input
                name="subtitle"
                defaultValue={product.subtitle || ""}
                placeholder="e.g. 4-Piece Motorcycle Emergency Safety Kit"
              />
            </label>

            <div className="cols">
              <label>
                Category
                <input
                  name="category"
                  defaultValue={product.category || ""}
                  placeholder="e.g. Motorcycle & Helmet Safety"
                />
              </label>

              <label>
                Badge / Rating Text
                <input
                  name="rating_text"
                  defaultValue={product.rating_text || ""}
                  placeholder="e.g. 100% Waterproof & UV Weather Resistant"
                />
              </label>
            </div>

            <label>
              Full Description
              <textarea
                name="description"
                rows={5}
                defaultValue={product.description || ""}
                placeholder="Detailed description of the product, benefits, and how it protects the user..."
              />
            </label>

            <label>
              Key Safety Features (one per line)
              <textarea
                name="features"
                rows={4}
                defaultValue={product.features || ""}
                placeholder="1. High-Impact PVC Helmet Tag&#10;2. Emergency Key Chain Tag&#10;3. Waterproof Visor Stickers"
              />
            </label>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 4 }}>
              <h3 style={{ fontSize: 14, marginBottom: 8 }}>Product Image</h3>
              <label>
                Image URL (or public path)
                <input
                  name="image_url"
                  defaultValue={product.image_url || ""}
                  placeholder="e.g. /gt-logo.png or https://example.com/tag.jpg"
                />
              </label>

              <label style={{ marginTop: 8 }}>
                Upload New Image File (from device)
                <input
                  name="image_file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  style={{ background: "#1a1a1e", padding: 6 }}
                />
              </label>
            </div>

            <label className="check" style={{ marginTop: 10 }}>
              <input type="checkbox" name="active" defaultChecked={product.active} />
              <strong>Active &amp; Available in Store</strong> (uncheck to mark as Coming Soon / Hidden)
            </label>

            <div style={{ marginTop: 12 }}>
              <button type="submit" className="btn">
                Save Product Changes
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Live Store Preview & Stock Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <section className="card">
            <h2>Live Store Preview</h2>
            <div
              style={{
                background: "#08080a",
                border: "1px solid #222",
                borderRadius: 12,
                padding: 16,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 180,
                  background: "#121215",
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  border: "1px solid #282830",
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <div style={{ color: "#666", fontSize: 13, fontFamily: "monospace" }}>
                    [ 3D Tag Type: {product.tag_type} ]
                  </div>
                )}
              </div>

              <div style={{ textAlign: "left" }}>
                <span className={`pill ${product.active ? "active" : "disabled"}`} style={{ fontSize: 10 }}>
                  {product.active ? "AVAILABLE NOW" : "COMING SOON"}
                </span>
                <h3 style={{ fontSize: 18, margin: "6px 0 2px" }}>{product.name}</h3>
                <div style={{ color: "#facc15", fontWeight: 700, fontSize: 16 }}>
                  {inr(product.price_paise)}
                </div>
                {product.subtitle && (
                  <p className="muted" style={{ fontSize: 12, margin: "4px 0 8px" }}>
                    {product.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <Link
                href="/products"
                target="_blank"
                style={{ fontSize: 12, color: "var(--ac)" }}
              >
                View Public Store Page ↗
              </Link>
            </div>
          </section>

          <section className="card">
            <h2>Inventory &amp; Stock Level</h2>
            <div className="row" style={{ marginBottom: 12 }}>
              <span>Current Available Units:</span>
              <span className={`pill ${product.stock <= product.low_stock_at ? "cancelled" : "delivered"}`}>
                {product.stock} units
              </span>
            </div>
            <p className="muted" style={{ fontSize: 12 }}>
              To add or subtract stock units, use the{" "}
              <Link href="/admin/inventory" style={{ textDecoration: "underline" }}>
                Inventory Section
              </Link>
              .
            </p>
          </section>

          <section className="card" style={{ border: "1px solid #3a1212" }}>
            <h2 style={{ color: "#f87171" }}>Deactivate Product</h2>
            <p className="muted" style={{ fontSize: 12 }}>
              Hides this product from the customer store catalog without deleting past order records.
            </p>
            <form action={deleteProductAction}>
              <input type="hidden" name="sku" value={product.sku} />
              <button type="submit" className="ghost danger">
                Deactivate &amp; Hide from Store
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
