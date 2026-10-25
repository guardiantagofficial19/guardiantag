import Link from "next/link";
import { sql } from "@/lib/db";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductsListPage() {
  const products = await sql`
    SELECT 
      sku, 
      name, 
      tag_type, 
      price_paise, 
      stock, 
      low_stock_at, 
      active, 
      subtitle, 
      category, 
      image_url, 
      created_at
    FROM store_products 
    ORDER BY active DESC, tag_type, sku
  `;

  return (
    <>
      <div className="row" style={{ marginBottom: 16 }}>
        <div>
          <h1>Products Catalog</h1>
          <p className="muted" style={{ margin: 0 }}>
            Manage product descriptions, safety features, custom images, and pricing displayed on the store.
          </p>
        </div>
        <Link className="btn" href="/admin/products/new">
          + Add New Product
        </Link>
      </div>

      <div className="grid4" style={{ marginBottom: 20 }}>
        <div className="card stat">
          <b>{products.length}</b>
          <span>Total Products</span>
        </div>
        <div className="card stat">
          <b style={{ color: "#4ade80" }}>{products.filter((p) => p.active).length}</b>
          <span>Active in Store</span>
        </div>
        <div className="card stat">
          <b>{products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)}</b>
          <span>Total Units in Stock</span>
        </div>
        <div className="card stat">
          <b style={{ color: "#f87171" }}>
            {products.filter((p) => p.stock <= p.low_stock_at).length}
          </b>
          <span>Low Stock Alerts</span>
        </div>
      </div>

      <div className="card scroll">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ width: 64 }}>Image</th>
              <th>Product &amp; SKU</th>
              <th>Category &amp; Type</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Store Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.sku} style={{ verticalAlign: "middle" }}>
                <td>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      background: "#1c1c20",
                      border: "1px solid #2e2e34",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: "#8b8b93",
                      fontWeight: 700,
                    }}
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span>{p.tag_type}</span>
                    )}
                  </div>
                </td>

                <td>
                  <Link
                    href={`/admin/products/${encodeURIComponent(p.sku)}`}
                    style={{ fontWeight: 700, fontSize: 15 }}
                  >
                    {p.name}
                  </Link>
                  <div className="muted" style={{ fontSize: 12 }}>
                    SKU: <strong style={{ color: "#ccc" }}>{p.sku}</strong>
                  </div>
                  {p.subtitle && (
                    <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{p.subtitle}</div>
                  )}
                </td>

                <td>
                  <span className="pill" style={{ background: "#222", border: "1px solid #333" }}>
                    {p.tag_type}
                  </span>
                  {p.category && (
                    <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                      {p.category}
                    </div>
                  )}
                </td>

                <td>
                  <strong style={{ fontSize: 14 }}>{inr(p.price_paise)}</strong>
                </td>

                <td>
                  <span
                    className={`pill ${p.stock <= p.low_stock_at ? "cancelled" : "delivered"}`}
                  >
                    {p.stock} units
                  </span>
                </td>

                <td>
                  {p.active ? (
                    <span className="pill active">Active (Live)</span>
                  ) : (
                    <span className="pill disabled">Hidden (Coming Soon)</span>
                  )}
                </td>

                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 8 }}>
                    <Link
                      className="btn small"
                      href={`/admin/products/${encodeURIComponent(p.sku)}`}
                    >
                      Edit Product
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {!products.length && (
              <tr>
                <td colSpan={7} className="muted" style={{ textAlign: "center", padding: 24 }}>
                  No products in catalog. Click "+ Add New Product" above to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
