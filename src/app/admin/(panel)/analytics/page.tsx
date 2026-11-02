import { sql } from "@/lib/db";
import { inr, dt } from "@/lib/format";
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

type SP = { range?: string };

export default async function ShopifyAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const { range = "30d" } = await searchParams;

  const intervalMap: Record<string, string> = {
    today: "interval '1 day'",
    "7d": "interval '7 days'",
    "30d": "interval '30 days'",
    "90d": "interval '90 days'",
    all: "interval '100 years'",
  };

  const selectedInterval = intervalMap[range] || "interval '30 days'";

  const [overview, topProducts, byState, recentSales] = await Promise.all([
    sql`
      SELECT 
        COUNT(*)::int as total_orders,
        COUNT(DISTINCT phone)::int as unique_customers,
        COALESCE(SUM(total_paise) FILTER (WHERE payment_status = 'paid'), 0)::bigint as total_paid_sales,
        COALESCE(SUM(total_paise), 0)::bigint as gross_sales,
        COALESCE(SUM(total_paise) FILTER (WHERE payment_status = 'unpaid' AND status <> 'cancelled'), 0)::bigint as unpaid_sales,
        COUNT(*) FILTER (WHERE status = 'delivered')::int as completed_orders
      FROM store_orders
      WHERE created_at >= (now() - ${selectedInterval}::interval)
    `,
    sql`
      SELECT 
        i.sku,
        i.name,
        SUM(i.qty)::int as units_sold,
        SUM(i.unit_paise * i.qty)::bigint as revenue_paise
      FROM store_order_items i
      JOIN store_orders o ON i.order_id = o.id
      WHERE o.status <> 'cancelled' AND o.created_at >= (now() - ${selectedInterval}::interval)
      GROUP BY i.sku, i.name
      ORDER BY revenue_paise DESC
      LIMIT 6
    `,
    sql`
      SELECT 
        COALESCE(NULLIF(state, ''), NULLIF(city, ''), 'India') as region,
        COUNT(*)::int as orders_count,
        SUM(total_paise)::bigint as region_revenue
      FROM store_orders
      WHERE status <> 'cancelled' AND created_at >= (now() - ${selectedInterval}::interval)
      GROUP BY 1
      ORDER BY region_revenue DESC
      LIMIT 5
    `,
    sql`
      SELECT id, order_no, customer_name, total_paise, payment_status, created_at
      FROM store_orders
      ORDER BY created_at DESC
      LIMIT 8
    `,
  ]);

  const o = overview[0] || {};
  const totalSales = Number(o.total_paid_sales || 0);
  const totalOrders = Number(o.total_orders || 0);
  const aov = totalOrders > 0 ? Math.round(Number(o.gross_sales || 0) / totalOrders) : 0;
  const uniqueCustomers = Number(o.unique_customers || 0);
  const repeatRate =
    uniqueCustomers > 0 && totalOrders > uniqueCustomers
      ? Math.round(((totalOrders - uniqueCustomers) / uniqueCustomers) * 100)
      : 0;

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <div className="page-subtitle">
            Sales performance, conversion trends, and financial breakdown for GuardianTag.
          </div>
        </div>

        {/* Date Filter Tabs */}
        <div className="polaris-tabs" style={{ backgroundColor: "#ffffff", padding: "3px", borderRadius: 8, border: "1px solid var(--shopify-border)" }}>
          <a
            href="/admin/analytics?range=today"
            className={`polaris-tab ${range === "today" ? "active" : ""}`}
          >
            Today
          </a>
          <a
            href="/admin/analytics?range=7d"
            className={`polaris-tab ${range === "7d" ? "active" : ""}`}
          >
            7 Days
          </a>
          <a
            href="/admin/analytics?range=30d"
            className={`polaris-tab ${range === "30d" ? "active" : ""}`}
          >
            30 Days
          </a>
          <a
            href="/admin/analytics?range=90d"
            className={`polaris-tab ${range === "90d" ? "active" : ""}`}
          >
            90 Days
          </a>
          <a
            href="/admin/analytics?range=all"
            className={`polaris-tab ${range === "all" ? "active" : ""}`}
          >
            All Time
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Paid Sales</span>
            <DollarSign size={16} />
          </div>
          <div className="metric-value">{inr(totalSales)}</div>
          <div className="metric-subtext">
            <span className="trend-up">Verified Revenue</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Total Orders</span>
            <Package size={16} />
          </div>
          <div className="metric-value">{totalOrders}</div>
          <div className="metric-subtext">
            <span>{o.completed_orders || 0} successfully delivered</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Average Order Value</span>
            <TrendingUp size={16} />
          </div>
          <div className="metric-value">{inr(aov)}</div>
          <div className="metric-subtext">
            <span>Average cart checkout size</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Repeat Customer Rate</span>
            <Users size={16} />
          </div>
          <div className="metric-value">{repeatRate}%</div>
          <div className="metric-subtext">
            <span>{uniqueCustomers} unique buyers</span>
          </div>
        </div>
      </div>

      {/* Detailed Reports Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Top Products Report */}
        <div className="polaris-card flush">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--shopify-border)" }}>
            <h2 style={{ margin: 0, fontSize: 14 }}>Top Products by Revenue</h2>
          </div>
          <table className="polaris-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units</th>
                <th style={{ textAlign: "right" }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.sku}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--shopify-text-subdued)" }}>
                      SKU: {p.sku}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.units_sold}</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "var(--shopify-green)" }}>
                    {inr(p.revenue_paise)}
                  </td>
                </tr>
              ))}
              {!topProducts.length && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "24px", color: "var(--shopify-text-subdued)" }}>
                    No sales recorded for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Regional Distribution */}
        <div className="polaris-card flush">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--shopify-border)" }}>
            <h2 style={{ margin: 0, fontSize: 14 }}>Sales by Delivery Region (India)</h2>
          </div>
          <table className="polaris-table">
            <thead>
              <tr>
                <th>State / Region</th>
                <th>Orders</th>
                <th style={{ textAlign: "right" }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {byState.map((s, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <MapPin size={13} color="var(--shopify-green)" />
                      <span>{s.region}</span>
                    </div>
                  </td>
                  <td>{s.orders_count} orders</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                    {inr(s.region_revenue)}
                  </td>
                </tr>
              ))}
              {!byState.length && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "24px", color: "var(--shopify-text-subdued)" }}>
                    No geographic order data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Ledger / Transactions */}
      <div className="polaris-card flush">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--shopify-border)" }}>
          <h2 style={{ margin: 0, fontSize: 14 }}>Recent Financial Transactions</h2>
        </div>
        <table className="polaris-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Payment Status</th>
              <th style={{ textAlign: "right" }}>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: "var(--shopify-green)" }}>{r.order_no}</td>
                <td>{r.customer_name}</td>
                <td style={{ fontSize: 12, color: "var(--shopify-text-subdued)" }}>
                  {dt(r.created_at)}
                </td>
                <td>
                  <span className={`polaris-badge ${r.payment_status}`}>
                    {r.payment_status}
                  </span>
                </td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>{inr(r.total_paise)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
