import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { inr, dt, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/format";
import { updateOrderAction } from "../../../actions";
import ConfirmButton from "@/components/ConfirmButton";
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  User,
  MapPin,
  MessageCircle,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const UUID = /^[0-9a-f-]{36}$/i;

export default async function ShopifyOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const [o] = await sql`SELECT * FROM store_orders WHERE id = ${id}`;
  if (!o) notFound();

  const items = await sql`SELECT * FROM store_order_items WHERE order_id = ${id}`;
  const cancelled = o.status === "cancelled";

  // Pre-fill WhatsApp customer update message
  const whatsappUpdateMsg = [
    `Hi ${o.customer_name}! Updating you regarding your GuardianTag Order ${o.order_no}:`,
    `Status: ${o.status.toUpperCase()}`,
    o.courier ? `Courier: ${o.courier}` : "",
    o.tracking_no ? `Tracking No: ${o.tracking_no}` : "",
    `Payment: ${o.payment_status.toUpperCase()}`,
    `Thank you for trusting GuardianTag!`,
  ]
    .filter(Boolean)
    .join("\n");

  const customerPhoneClean = o.phone ? o.phone.replace(/[^0-9]/g, "").slice(-10) : "";
  const waUrl = `https://wa.me/91${customerPhoneClean}?text=${encodeURIComponent(whatsappUpdateMsg)}`;

  return (
    <>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/admin/orders"
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
          <span>Orders</span>
        </Link>
      </div>

      {/* Order Title Bar */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1>{o.order_no}</h1>
            <span className={`polaris-badge ${o.status}`}>{o.status}</span>
            <span className={`polaris-badge ${o.payment_status}`}>{o.payment_status}</span>
          </div>
          <div className="page-subtitle" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={13} />
            <span>Placed on {dt(o.created_at)}</span>
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
            <span>Send WhatsApp Update</span>
          </a>
        </div>
      </div>

      {/* Two-Column Shopify Order Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Left Column: Items & Fulfillment Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Purchased Line Items Card */}
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
              <Package size={17} color="var(--shopify-green)" />
              <h2 style={{ margin: 0, fontSize: 14 }}>
                Purchased Items ({items.reduce((s, i) => s + (Number(i.qty) || 0), 0)} units)
              </h2>
            </div>

            <table className="polaris-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{i.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--shopify-text-subdued)" }}>
                        SKU: {i.sku}
                      </div>
                    </td>
                    <td>× {i.qty}</td>
                    <td>{inr(i.unit_paise)}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      {inr(i.unit_paise * i.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--shopify-border)",
                backgroundColor: "#fafbfb",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--shopify-text-subdued)" }}>Subtotal</span>
                <span>{inr(items.reduce((s, i) => s + i.unit_paise * i.qty, 0))}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--shopify-text-subdued)" }}>Standard Shipping (India)</span>
                <span>{inr(o.shipping_paise)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 15,
                  fontWeight: 700,
                  borderTop: "1px solid var(--shopify-border)",
                  paddingTop: 8,
                  marginTop: 4,
                }}
              >
                <span>Total Paid / Due</span>
                <span style={{ color: "var(--shopify-green)" }}>{inr(o.total_paise)}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment & Tracking Card */}
          <div className="polaris-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid var(--shopify-border)",
              }}
            >
              <Truck size={17} color="var(--shopify-green)" />
              <h2 style={{ margin: 0, fontSize: 14 }}>Fulfillment & Courier Tracking</h2>
            </div>

            <form action={updateOrderAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input type="hidden" name="id" value={o.id} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="polaris-form-group">
                  <label className="polaris-label">Fulfillment Status</label>
                  <select
                    name="status"
                    defaultValue={o.status}
                    disabled={cancelled}
                    className="polaris-select"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  {cancelled && <input type="hidden" name="status" value="cancelled" />}
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Payment Status</label>
                  <select
                    name="payment_status"
                    defaultValue={o.payment_status}
                    className="polaris-select"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="polaris-form-group">
                  <label className="polaris-label">Courier Name</label>
                  <input
                    name="courier"
                    defaultValue={o.courier ?? ""}
                    placeholder="Delhivery, India Post, Blue Dart…"
                    className="polaris-input"
                  />
                </div>

                <div className="polaris-form-group">
                  <label className="polaris-label">Tracking Number</label>
                  <input
                    name="tracking_no"
                    defaultValue={o.tracking_no ?? ""}
                    placeholder="AWB / Tracking Number"
                    className="polaris-input"
                  />
                </div>
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Internal Order Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={o.notes ?? ""}
                  placeholder="Notes, custom etching details, or delivery instructions…"
                  className="polaris-textarea"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <ConfirmButton
                  ifField={{ name: "status", value: "cancelled" }}
                  message="Cancel this order? Items will be automatically returned to inventory."
                >
                  Save Changes
                </ConfirmButton>
                {cancelled && (
                  <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>
                    Order has been cancelled. Inventory restored.
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Customer Card */}
          <div className="polaris-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: "1px solid var(--shopify-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <User size={16} color="var(--shopify-green)" />
                <h3 style={{ margin: 0 }}>Customer</h3>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "var(--shopify-green)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </a>
            </div>

            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{o.customer_name}</div>
            <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 4 }}>
              📞 {o.phone}
            </div>
            {o.email && (
              <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 2 }}>
                ✉️ {o.email}
              </div>
            )}
          </div>

          {/* Delivery Address Card */}
          <div className="polaris-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: "1px solid var(--shopify-border)",
              }}
            >
              <MapPin size={16} color="var(--shopify-green)" />
              <h3 style={{ margin: 0 }}>Shipping Address</h3>
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--shopify-text)" }}>
              {o.address}
              <div style={{ fontWeight: 600, marginTop: 4 }}>
                {[o.city, o.state, o.pincode].filter(Boolean).join(", ")}
              </div>
            </div>
          </div>

          {/* Custom Etching & Special Instructions */}
          {o.notes && (
            <div className="polaris-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--shopify-border)",
                }}
              >
                <FileText size={16} color="#d97706" />
                <h3 style={{ margin: 0 }}>Custom Instructions / Etching</h3>
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fef3c7",
                  padding: "10px 12px",
                  borderRadius: 6,
                  color: "#92400e",
                  fontWeight: 500,
                }}
              >
                {o.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
