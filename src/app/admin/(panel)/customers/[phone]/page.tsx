import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { inr, dt } from "@/lib/format";
import { ArrowLeft, Phone, Mail, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifyCustomerDetailPage({
  params,
}: {
  params: Promise<{ phone: string }>;
}) {
  const { phone: rawPhone } = await params;
  const decodedPhone = decodeURIComponent(rawPhone).trim();

  // Find all orders for this phone number
  const orders = await sql`
    SELECT * FROM store_orders
    WHERE phone = ${decodedPhone} OR phone = ${'+91' + decodedPhone.replace(/[^0-9]/g, '').slice(-10)} OR phone LIKE ${'%' + decodedPhone.slice(-10)}
    ORDER BY created_at DESC
  `;

  if (!orders.length) notFound();

  const primary = orders[0];
  const totalSpent = orders.reduce((s, o) => s + (Number(o.total_paise) || 0), 0);
  const totalOrders = orders.length;

  const phoneClean = decodedPhone.replace(/[^0-9]/g, "").slice(-10);
  const waUrl = `https://wa.me/91${phoneClean}?text=${encodeURIComponent(`Hi ${primary.customer_name}, message from GuardianTag Store Manager:`)}`;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/admin/customers"
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
          <span>All Customers</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1>{primary.customer_name}</h1>
            {totalOrders > 1 && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#0369a1",
                  backgroundColor: "#e0f2fe",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                Repeat Buyer ({totalOrders} Orders)
              </span>
            )}
          </div>
          <div className="page-subtitle">
            Customer since {dt(orders[orders.length - 1].created_at)}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-polaris-whatsapp"
          >
            <MessageCircle size={15} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Two-Column Shopify Customer Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Left Column: Orders History */}
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
            <h2 style={{ margin: 0, fontSize: 14 }}>Order History ({orders.length})</h2>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--shopify-green)" }}>
              Lifetime Value: {inr(totalSpent)}
            </span>
          </div>

          <table className="polaris-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      style={{ fontWeight: 700, color: "var(--shopify-green)" }}
                    >
                      {o.order_no}
                    </Link>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--shopify-text-subdued)" }}>
                    {dt(o.created_at)}
                  </td>
                  <td>
                    <span className={`polaris-badge ${o.payment_status}`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td>
                    <span className={`polaris-badge ${o.status}`}>{o.status}</span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>{inr(o.total_paise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column: Customer Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Contact Card */}
          <div className="polaris-card">
            <h3 style={{ margin: "0 0 12px", paddingBottom: 8, borderBottom: "1px solid var(--shopify-border)" }}>
              Contact Overview
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={14} color="var(--shopify-text-subdued)" />
                <span style={{ fontWeight: 600 }}>{primary.phone}</span>
              </div>
              {primary.email && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={14} color="var(--shopify-text-subdued)" />
                  <span>{primary.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Default Shipping Address */}
          <div className="polaris-card">
            <h3 style={{ margin: "0 0 12px", paddingBottom: 8, borderBottom: "1px solid var(--shopify-border)" }}>
              Default Address
            </h3>

            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              <div>{primary.customer_name}</div>
              <div style={{ color: "var(--shopify-text-subdued)" }}>{primary.address}</div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>
                {[primary.city, primary.state, primary.pincode].filter(Boolean).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
