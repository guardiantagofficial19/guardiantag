import { sql } from "@/lib/db";
import {
  Settings,
  Store,
  DollarSign,
  MessageCircle,
  ShieldCheck,
  Database,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifySettingsPage() {
  let dbStatus = "Connected";
  try {
    await sql`SELECT 1`;
  } catch {
    dbStatus = "Error";
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <div className="page-subtitle">
            Manage your store details, WhatsApp notification preferences, and system security.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Store Details</div>
          <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 4 }}>
            GuardianTag public branding, default currency, and operational timezone.
          </div>
        </div>

        <div className="polaris-card">
          <div className="polaris-form-group">
            <label className="polaris-label">Store Name</label>
            <input
              type="text"
              readOnly
              defaultValue="GuardianTag — Emergency Smart QR Ecosystem"
              className="polaris-input"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="polaris-form-group">
              <label className="polaris-label">Store Currency</label>
              <input type="text" readOnly defaultValue="INR (₹) — Indian Rupee" className="polaris-input" />
            </div>
            <div className="polaris-form-group">
              <label className="polaris-label">Timezone</label>
              <input type="text" readOnly defaultValue="Asia/Kolkata (GMT+5:30)" className="polaris-input" />
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: 0, borderTop: "1px solid var(--shopify-border)", margin: "24px 0" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>WhatsApp Order Dispatch</div>
          <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 4 }}>
            Direct customer receipts and merchant notifications sent on every order.
          </div>
        </div>

        <div className="polaris-card">
          <div className="polaris-form-group">
            <label className="polaris-label">Merchant WhatsApp Phone Number</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="text"
                readOnly
                defaultValue="+91 80588 00880"
                className="polaris-input"
                style={{ fontWeight: 600 }}
              />
              <span className="polaris-badge active">Verified</span>
            </div>
            <div className="polaris-help-text">
              Every checkout order automatically generates pre-formatted order details targeting this WhatsApp number.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              Auto-generate Customer WhatsApp Confirmation Link on Checkout
            </span>
          </div>
        </div>
      </div>

      <hr style={{ border: 0, borderTop: "1px solid var(--shopify-border)", margin: "24px 0" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>System & Security Architecture</div>
          <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 4 }}>
            Database connection health, session signing, and edge security headers.
          </div>
        </div>

        <div className="polaris-card">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Database size={16} color="var(--shopify-text-subdued)" />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Neon PostgreSQL Database</span>
              </div>
              <span className={`polaris-badge ${dbStatus === "Connected" ? "active" : "danger"}`}>
                {dbStatus}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={16} color="var(--shopify-text-subdued)" />
                <span style={{ fontSize: 13, fontWeight: 500 }}>HMAC-SHA256 Session Signature</span>
              </div>
              <span className="polaris-badge active">Enforced</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Store size={16} color="var(--shopify-text-subdued)" />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Public Customer PII Protection</span>
              </div>
              <span className="polaris-badge active">Hardened</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
