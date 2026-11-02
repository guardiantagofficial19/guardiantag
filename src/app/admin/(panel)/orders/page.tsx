import Link from "next/link";
import { sql } from "@/lib/db";
import { inr, dt, ORDER_STATUSES } from "@/lib/format";
import {
  Package,
  Plus,
  Search,
  MessageCircle,
  Truck,
  ExternalLink,
  Filter,
} from "lucide-react";

type SP = { status?: string; payment?: string; q?: string };

export default async function ShopifyOrdersPage({ searchParams }: { searchParams: Promise<SP> }) {
  const { status, payment, q } = await searchParams;
  const st = status && (ORDER_STATUSES as readonly string[]).includes(status) ? status : null;
  const pat = q ? `%${q}%` : null;

  const orders = await sql`
    SELECT id, order_no, customer_name, phone, email, city, status, payment_status, total_paise, created_at,
      (SELECT COALESCE(sum(qty), 0)::int FROM store_order_items i WHERE i.order_id = o.id) AS units,
      (SELECT string_agg(i.name || ' (x' || i.qty || ')', ', ') FROM store_order_items i WHERE i.order_id = o.id) AS item_summary
    FROM store_orders o
    WHERE (${st}::text IS NULL OR status = ${st}::text)
      AND (${payment ? payment : null}::text IS NULL OR payment_status = ${payment}::text)
      AND (${pat}::text IS NULL OR order_no ILIKE ${pat}::text OR customer_name ILIKE ${pat}::text OR phone ILIKE ${pat}::text OR tracking_no ILIKE ${pat}::text)
    ORDER BY created_at DESC LIMIT 200`;

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <div className="page-subtitle">
            Manage customer checkouts, mark items fulfilled, and dispatch tracking details.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/orders/new" className="btn-polaris-primary">
            <Plus size={15} />
            <span>Create order</span>
          </Link>
        </div>
      </div>

      {/* Orders Filter & Data Card */}
      <div className="polaris-card flush">
        {/* Shopify Polaris Tabs & Search Bar */}
        <div className="filter-bar-container">
          <div className="polaris-tabs">
            <Link
              href="/admin/orders"
              className={`polaris-tab ${!st && !payment ? "active" : ""}`}
            >
              All
            </Link>
            <Link
              href="/admin/orders?status=new"
              className={`polaris-tab ${st === "new" ? "active" : ""}`}
            >
              Unfulfilled
            </Link>
            <Link
              href="/admin/orders?payment=unpaid"
              className={`polaris-tab ${payment === "unpaid" ? "active" : ""}`}
            >
              Unpaid
            </Link>
            <Link
              href="/admin/orders?status=shipped"
              className={`polaris-tab ${st === "shipped" ? "active" : ""}`}
            >
              Shipped
            </Link>
            <Link
              href="/admin/orders?status=delivered"
              className={`polaris-tab ${st === "delivered" ? "active" : ""}`}
            >
              Delivered
            </Link>
          </div>

          <form className="filter-search-form" method="GET">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by order #, name, phone..."
              className="filter-input"
            />
            {st && <input type="hidden" name="status" value={st} />}
            {payment && <input type="hidden" name="payment" value={payment} />}
          </form>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="polaris-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Total</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const whatsappMsg = `Hi ${o.customer_name}, regarding your GuardianTag Order ${o.order_no}: `;
                const waUrl = `https://wa.me/91${o.phone.replace(/[^0-9]/g, "").slice(-10)}?text=${encodeURIComponent(whatsappMsg)}`;

                return (
                  <tr key={o.id}>
                    <td>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        style={{
                          fontWeight: 700,
                          color: "var(--shopify-green)",
                          display: "inline-block",
                        }}
                      >
                        {o.order_no}
                      </Link>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--shopify-text-subdued)" }}>
                      {dt(o.created_at)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--shopify-text-subdued)" }}>
                        {o.phone} {o.city ? `• ${o.city}` : ""}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>
                        {o.units} {o.units === 1 ? "unit" : "units"}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--shopify-text-subdued)",
                          maxWidth: 200,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={o.item_summary}
                      >
                        {o.item_summary || "GuardianTag Kit"}
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
                    <td style={{ fontWeight: 700 }}>{inr(o.total_paise)}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-polaris-whatsapp"
                          title="Open WhatsApp with Customer"
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp</span>
                        </a>
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="btn-polaris-secondary"
                          style={{ padding: "5px 10px", fontSize: 12 }}
                        >
                          Manage
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!orders.length && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "48px 16px",
                      color: "var(--shopify-text-subdued)",
                    }}
                  >
                    <Package
                      size={36}
                      style={{ margin: "0 auto 10px", opacity: 0.4, display: "block" }}
                    />
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--shopify-text)" }}>
                      No orders found
                    </div>
                    <div style={{ fontSize: 12.5, marginTop: 4 }}>
                      Try changing your search term or tab filters.
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
