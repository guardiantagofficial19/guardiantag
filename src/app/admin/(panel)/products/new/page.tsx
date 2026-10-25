import Link from "next/link";
import { TAG_TYPES } from "@/lib/format";
import { createFullProductAction } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/products" className="muted" style={{ fontSize: 13 }}>
          ← Back to Products Catalog
        </Link>
        <div className="row" style={{ marginTop: 8 }}>
          <h1>Add New Product</h1>
        </div>
      </div>

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

      <section className="card" style={{ maxWidth: 800 }}>
        <h2>Product Details &amp; Hardware Attributes</h2>

        <form action={createFullProductAction} className="form" encType="multipart/form-data">
          <div className="cols">
            <label>
              Product SKU (Unique ID) *
              <input
                name="sku"
                placeholder="e.g. GTB-SOLO, GT-DECAL-02"
                style={{ textTransform: "uppercase" }}
                required
              />
            </label>

            <label>
              Tag Type *
              <select name="tag_type">
                {TAG_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="CUSTOM">CUSTOM</option>
              </select>
            </label>
          </div>

          <label>
            Product Title / Name *
            <input name="name" placeholder="e.g. GTB High-Visibility Helmet Tag" required />
          </label>

          <div className="cols">
            <label>
              Price in INR (₹) *
              <input
                name="price"
                type="number"
                step="0.01"
                min={0}
                placeholder="499"
                defaultValue={499}
                required
              />
            </label>

            <label>
              Initial Opening Stock *
              <input
                name="stock"
                type="number"
                min={0}
                placeholder="50"
                defaultValue={50}
                required
              />
            </label>
          </div>

          <label>
            Subtitle (One-line description)
            <input
              name="subtitle"
              placeholder="e.g. Reflective Waterproof Helmet Tag with Masked Emergency Relay"
            />
          </label>

          <div className="cols">
            <label>
              Category
              <input name="category" placeholder="e.g. Motorcycle & Helmet Safety" />
            </label>

            <label>
              Badge / Rating Text
              <input
                name="rating_text"
                placeholder="e.g. 100% Waterproof & UV Weather Resistant"
                defaultValue="100% Waterproof & UV Weather Resistant"
              />
            </label>
          </div>

          <label>
            Full Product Description
            <textarea
              name="description"
              rows={5}
              placeholder="Detailed description of the product, physical construction, and emergency benefits..."
            />
          </label>

          <label>
            Key Safety Features (one per line)
            <textarea
              name="features"
              rows={4}
              placeholder="1. Curved flex fit for motorcycle helmets&#10;2. High-contrast optical QR pattern&#10;3. Weatherproof heavy-duty adhesive"
            />
          </label>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 4 }}>
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>Product Image</h3>
            <label>
              Image URL (optional)
              <input name="image_url" placeholder="e.g. /gt-logo.png or https://example.com/tag.jpg" />
            </label>

            <label style={{ marginTop: 8 }}>
              Upload Image File (from your computer or phone)
              <input
                name="image_file"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                style={{ background: "#1a1a1e", padding: 6 }}
              />
            </label>
          </div>

          <label className="check" style={{ marginTop: 10 }}>
            <input type="checkbox" name="active" defaultChecked />
            <strong>Active &amp; Visible in Store</strong> (check to show live on /products)
          </label>

          <div style={{ marginTop: 16 }}>
            <button type="submit" className="btn">
              Create &amp; Publish Product
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
