import Link from "next/link";
import { sql } from "@/lib/db";
import { inr } from "@/lib/format";
import { Tag, Plus, ExternalLink, AlertTriangle, CheckCircle2, Layers, Search } from "lucide-react";

export const dynamic = "force-dynamic";

type SP = { status?: string; q?: string };

export default async function ShopifyProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const { status, q } = await searchParams;
  const pat = q ? `%${q}%` : null;

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
    WHERE (${status === "active" ? true : status === "draft" ? false : null}::boolean IS NULL OR active = ${status === "active"})
      AND (${pat}::text IS NULL OR name ILIKE ${pat}::text OR sku ILIKE ${pat}::text OR category ILIKE ${pat}::text)
    ORDER BY active DESC, tag_type, sku
  `;

  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= p.low_stock_at).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <div className="page-subtitle">
            Manage your hardware tag kits, descriptions, imagery, and real-time inventory levels.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-polaris-secondary"
          >
            <span>Live Store Catalog</span>
            <ExternalLink size={13} />
          </a>
          <Link href="/admin/products/new" className="btn-polaris-primary">
            <Plus size={15} />
            <span>Add product</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Catalog</span>
            <Tag size={16} />
          </div>
          <div className="metric-value">{products.length}</div>
          <div className="metric-subtext">Product SKUs</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Active in Store</span>
            <CheckCircle2 size={16} color="#16a34a" />
          </div>
          <div className="metric-value" style={{ color: "var(--shopify-green)" }}>
            {products.filter((p) => p.active).length}
          </div>
          <div className="metric-subtext">Live on customer storefront</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Total Stock</span>
            <Layers size={16} />
          </div>
          <div className="metric-value">{totalStock}</div>
          <div className="metric-subtext">Physical units ready to ship</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Low Stock Alerts</span>
            <AlertTriangle size={16} color={lowStockCount > 0 ? "#dc2626" : "#64748b"} />
          </div>
          <div className="metric-value" style={{ color: lowStockCount > 0 ? "#dc2626" : "inherit" }}>
            {lowStockCount}
          </div>
          <div className="metric-subtext">Below threshold</div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="polaris-card flush">
        <div className="filter-bar-container">
          <div className="polaris-tabs">
            <Link
              href="/admin/products"
              className={`polaris-tab ${!status ? "active" : ""}`}
            >
              All
            </Link>
            <Link
              href="/admin/products?status=active"
              className={`polaris-tab ${status === "active" ? "active" : ""}`}
            >
              Active
            </Link>
            <Link
              href="/admin/products?status=draft"
              className={`polaris-tab ${status === "draft" ? "active" : ""}`}
            >
              Drafts
            </Link>
          </div>

          <form className="filter-search-form" method="GET">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search products, SKU, category..."
              className="filter-input"
            />
          </form>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="polaris-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Inventory</th>
                <th>Category</th>
                <th>Price</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isLow = p.stock <= p.low_stock_at;

                return (
                  <tr key={p.sku}>
                    <td>
                      <div className="product-cell">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="table-thumb"
                          />
                        ) : (
                          <div
                            className="table-thumb"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--shopify-text-subdued)",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            {p.tag_type || "GT"}
                          </div>
                        )}
                        <div className="product-cell-info">
                          <Link
                            href={`/admin/products/${encodeURIComponent(p.sku)}`}
                            className="product-cell-name"
                          >
                            {p.name}
                          </Link>
                          <span className="product-cell-sub">
                            SKU: {p.sku} {p.subtitle ? `• ${p.subtitle}` : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`polaris-badge ${p.active ? "active" : "draft"}`}>
                        {p.active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td>
                      {isLow ? (
                        <span className="polaris-badge danger">
                          {p.stock} in stock (Low)
                        </span>
                      ) : (
                        <span className="polaris-badge neutral">
                          {p.stock} in stock
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--shopify-text-subdued)",
                          backgroundColor: "#f1f2f4",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontWeight: 500,
                        }}
                      >
                        {p.category || p.tag_type || "Kit"}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{inr(p.price_paise)}</td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href={`/admin/products/${encodeURIComponent(p.sku)}`}
                        className="btn-polaris-secondary"
                        style={{ padding: "5px 12px", fontSize: 12 }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {!products.length && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "var(--shopify-text-subdued)" }}>
                    <Tag size={36} style={{ margin: "0 auto 10px", opacity: 0.4, display: "block" }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--shopify-text)" }}>
                      No products found
                    </div>
                    <div style={{ fontSize: 12.5, marginTop: 4 }}>
                      <Link href="/admin/products/new" style={{ color: "var(--shopify-green)", fontWeight: 600 }}>
                        + Add your first product
                      </Link>
                    </div>
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
