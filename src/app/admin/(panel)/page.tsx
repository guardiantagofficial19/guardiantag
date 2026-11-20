import Link from "next/link";
import { sql } from "@/lib/db";
import { inr, dt } from "@/lib/format";
import { Package, DollarSign, TrendingUp, AlertTriangle, ArrowRight, Plus, CheckCircle2, Clock, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifyDashboard() {
  const [stats, lowStock, tagCounts, recentOrders] = await Promise.all([
    sql`SELECT
      count(*)::int AS total_orders,
      count(*) FILTER (WHERE status = 'new')::int AS new_orders,
      count(*) FILTER (WHERE status IN ('new', 'packed'))::int AS to_ship,
      COALESCE(sum(total_paise) FILTER (WHERE payment_status = 'paid' AND status <> 'cancelled'), 0)::bigint AS total_revenue_paise,
      COALESCE(sum(total_paise) FILTER (WHERE payment_status = 'paid' AND status <> 'cancelled' AND created_at > now() - interval '30 days'), 0)::bigint AS rev30,
      COALESCE(sum(total_paise) FILTER (WHERE payment_status = 'unpaid' AND status <> 'cancelled'), 0)::bigint AS unpaid_paise
      FROM store_orders`,
    sql`SELECT sku, name, stock, low_stock_at FROM store_products WHERE active AND stock <= low_stock_at ORDER BY stock ASC LIMIT 5`,
    sql`SELECT status, count(*)::int AS count FROM qr_tags GROUP BY status ORDER BY count DESC`,
    sql`SELECT id, order_no, customer_name, phone, status, payment_status, total_paise, created_at FROM store_orders ORDER BY created_at DESC LIMIT 6`,
  ]);

  const s = stats[0] || {};
  const totalRevenue = Number(s.total_revenue_paise || 0);
  const totalOrders = Number(s.total_orders || 0);
  const aovPaise = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const toShipCount = Number(s.to_ship || 0);

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Store Overview</h1>
          <div className="page-subtitle">
            Real-time analytics, order fulfillment, and inventory health for GuardianTag.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/products/new" className="btn-polaris-secondary">
            <Plus size={15} />
            <span>Add product</span>
          </Link>
          <Link href="/admin/orders" className="btn-polaris-primary">
            <span>Manage Orders</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Action Banner: Orders to Fulfill */}
      {toShipCount > 0 ? (
        <div className="action-banner">
          <div className="action-banner-content">
            <div className="action-banner-icon">
              <Package size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#166534" }}>
                {toShipCount} {toShipCount === 1 ? "order requires" : "orders require"} fulfillment
              </div>
              <div style={{ fontSize: 12.5, color: "#15803d", marginTop: 2 }}>
                Pack tags, input shipping courier tracking, and update customers via WhatsApp.
              </div>
            </div>
          </div>
          <Link href="/admin/orders?status=new" className="btn-polaris-primary">
            Fulfill orders
          </Link>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 10,
            padding: "12px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#166534",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#16a34a" />
          <span>All customer orders are currently packed and dispatched!</span>
        </div>
      )}

      {/* Shopify Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Sales</span>
            <DollarSign size={16} />
          </div>
          <div className="metric-value">{inr(totalRevenue)}</div>
          <div className="metric-subtext">
            <span className="trend-up">+{inr(s.rev30 || 0)}</span>
            <span>last 30 days</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Total Orders</span>
            <Package size={16} />
          </div>
          <div className="metric-value">{totalOrders}</div>
          <div className="metric-subtext">
            <span>{s.new_orders || 0} pending new</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Average Order Value</span>
            <TrendingUp size={16} />
          </div>
          <div className="metric-value">{inr(aovPaise)}</div>
          <div className="metric-subtext">
            <span>Across all online sales</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Pending Payment</span>
            <Clock size={16} />
          </div>
          <div className="metric-value" style={{ color: "#b45309" }}>
            {inr(s.unpaid_paise || 0)}
          </div>
          <div className="metric-subtext">
            <span>COD or pending checkout</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Orders & Side Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Left Column: Recent Orders */}
        <div className="polaris-card flush">
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--shopify-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Recent Orders</h2>
              <div style={{ fontSize: 12, color: "var(--shopify-text-subdued)", marginTop: 2 }}>
                Latest online store purchases and delivery status
              </div>
            </div>
            <Link href="/admin/orders" className="btn-polaris-secondary">
              View all orders
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="polaris-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Fulfillment</th>
                  <th>Total</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        style={{ fontWeight: 600, color: "var(--shopify-green)" }}
                      >
                        {o.order_no}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{o.customer_name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--shopify-text-subdued)" }}>
                        {o.phone}
                      </div>
                    </td>
                    <td>
                      <span className={`polaris-badge ${o.payment_status}`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td>
                      <span className={`polaris-badge ${o.status}`}>{o.status}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{inr(o.total_paise)}</td>
                    <td style={{ fontSize: 12, color: "var(--shopify-text-subdued)" }}>
                      {dt(o.created_at)}
                    </td>
                  </tr>
                ))}
                {!recentOrders.length && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "36px 16px", color: "var(--shopify-text-subdued)" }}>
                      <Package size={32} style={{ margin: "0 auto 10px", opacity: 0.5, display: "block" }} />
                      No orders placed yet. <Link href="/admin/orders/new" style={{ color: "var(--shopify-green)", fontWeight: 600 }}>Create your first manual order</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Inventory & QR Hardware Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Low Stock Warning Card */}
          <div className="polaris-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 7 }}>
                <AlertTriangle size={16} color="#d97706" />
                <span>Inventory Alerts</span>
              </h3>
              <Link href="/admin/inventory" style={{ fontSize: 12, color: "var(--shopify-green)", fontWeight: 600 }}>
                Manage
              </Link>
            </div>

            {lowStock.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {lowStock.map((p) => (
                  <div
                    key={p.sku}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: 6,
                      backgroundColor: "#fff7ed",
                      border: "1px solid #ffedd5",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12.5 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#9a3412" }}>{p.sku}</div>
                    </div>
                    <span className="polaris-badge danger">
                      {p.stock} units left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>All product stock levels are healthy.</span>
              </div>
            )}
          </div>

          {/* QR Hardware Registry Status */}
          <div className="polaris-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 7 }}>
                <Shield size={16} color="#2563eb" />
                <span>QR Tag Registry</span>
              </h3>
              <Link href="/admin/tags" style={{ fontSize: 12, color: "var(--shopify-green)", fontWeight: 600 }}>
                View all
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tagCounts.map((t) => (
                <div
                  key={t.status}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid #f1f2f4",
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ textTransform: "capitalize", fontWeight: 500 }}>
                    {t.status} Tags
                  </span>
                  <span style={{ fontWeight: 700 }}>{t.count}</span>
                </div>
              ))}
              {!tagCounts.length && (
                <div style={{ fontSize: 12, color: "var(--shopify-text-subdued)" }}>
                  No QR tags in database. <Link href="/admin/tags" style={{ color: "var(--shopify-green)" }}>Generate a batch</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
