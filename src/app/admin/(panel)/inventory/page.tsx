import { sql } from "@/lib/db";
import { dt } from "@/lib/format";
import { adjustStockAction, updateProductAction } from "../../actions";
import { ArrowUpDown, History } from "lucide-react";

export default async function ShopifyInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [products, moves] = await Promise.all([
    sql`SELECT * FROM store_products ORDER BY tag_type, sku`,
    sql`SELECT m.*, p.name FROM stock_movements m JOIN store_products p USING (sku) ORDER BY m.created_at DESC LIMIT 15`,
  ]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Inventory & Stock Adjustments</h1>
          <div className="page-subtitle">
            Track available units, record batch intake, adjust physical stock counts, and view audit movements.
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

      {/* Product Stock Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        {products.map((p) => {
          const isLow = p.stock <= p.low_stock_at;

          return (
            <div key={p.sku} className="polaris-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--shopify-border)",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: 15 }}>
                    {p.name}{" "}
                    <span style={{ fontSize: 12, color: "var(--shopify-text-subdued)", fontWeight: 400 }}>
                      (SKU: {p.sku})
                    </span>
                  </h2>
                </div>
                <span className={`polaris-badge ${isLow ? "danger" : "active"}`}>
                  {p.stock} units available
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Pricing & Thresholds */}
                <form action={updateProductAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input type="hidden" name="sku" value={p.sku} />
                  <div className="polaris-form-group" style={{ marginBottom: 8 }}>
                    <label className="polaris-label">Product Name</label>
                    <input name="name" defaultValue={p.name} required className="polaris-input" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div className="polaris-form-group" style={{ marginBottom: 8 }}>
                      <label className="polaris-label">Selling Price (₹)</label>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        min={0}
                        defaultValue={p.price_paise / 100}
                        className="polaris-input"
                      />
                    </div>
                    <div className="polaris-form-group" style={{ marginBottom: 8 }}>
                      <label className="polaris-label">Low Stock Alert</label>
                      <input
                        name="low_stock_at"
                        type="number"
                        min={0}
                        defaultValue={p.low_stock_at}
                        className="polaris-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                      <input type="checkbox" name="active" defaultChecked={p.active} />
                      <span>Active for checkout</span>
                    </label>
                    <button type="submit" className="btn-polaris-secondary">
                      Save Settings
                    </button>
                  </div>
                </form>

                {/* Quick Stock Adjustment */}
                <form
                  action={adjustStockAction}
                  style={{
                    backgroundColor: "#fafbfb",
                    padding: 14,
                    borderRadius: 8,
                    border: "1px solid var(--shopify-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <input type="hidden" name="sku" value={p.sku} />
                  <div style={{ fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowUpDown size={15} color="var(--shopify-green)" />
                    <span>Quick Stock Adjustment</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                    <div className="polaris-form-group" style={{ marginBottom: 0 }}>
                      <label className="polaris-label">Change</label>
                      <input
                        name="delta"
                        type="number"
                        placeholder="+50 or -3"
                        required
                        className="polaris-input"
                      />
                    </div>
                    <div className="polaris-form-group" style={{ marginBottom: 0 }}>
                      <label className="polaris-label">Reason / Notes</label>
                      <input
                        name="reason"
                        placeholder="Printer batch, damaged tag, count check…"
                        className="polaris-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn-polaris-primary" style={{ fontSize: 12.5 }}>
                      Apply Adjustment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Movement Audit Log */}
      <div className="polaris-card flush">
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--shopify-border)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <History size={16} color="var(--shopify-text-subdued)" />
          <h2 style={{ margin: 0, fontSize: 14 }}>Recent Inventory Stock Movements</h2>
        </div>

        <table className="polaris-table">
          <thead>
            <tr>
              <th>Product SKU</th>
              <th>Adjustment</th>
              <th>Reason</th>
              <th style={{ textAlign: "right" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>
                  <span
                    style={{
                      fontWeight: 700,
                      color: m.delta > 0 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {m.delta > 0 ? `+${m.delta}` : m.delta}
                  </span>
                </td>
                <td style={{ color: "var(--shopify-text)" }}>{m.reason}</td>
                <td style={{ textAlign: "right", color: "var(--shopify-text-subdued)", fontSize: 12 }}>
                  {dt(m.created_at)}
                </td>
              </tr>
            ))}
            {!moves.length && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "32px", color: "var(--shopify-text-subdued)" }}>
                  No stock adjustments recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
