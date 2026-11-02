import { sql } from "@/lib/db";
import { updateStoreSettingsAction } from "../../actions";
import {
  Settings,
  Store,
  DollarSign,
  MessageCircle,
  ShieldCheck,
  Database,
  Truck,
  FileText,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  const [settingsRows] = await Promise.all([
    sql`SELECT key, value FROM store_settings`,
  ]);

  const map: Record<string, string> = {};
  settingsRows.forEach((r) => {
    map[r.key] = r.value;
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Store Settings</h1>
          <div className="page-subtitle">
            Configure store branding, WhatsApp dispatch, taxes, shipping rules, and store policies.
          </div>
        </div>
      </div>

      {saved && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} />
          <span>Store settings saved successfully!</span>
        </div>
      )}

      <form action={updateStoreSettingsAction}>
        {/* Section 1: Store Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Store Details</div>
            <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 4 }}>
              GuardianTag storefront branding and customer communication address.
            </div>
          </div>

          <div className="polaris-card">
            <div className="polaris-form-group">
              <label className="polaris-label">Store Name</label>
              <input
                name="store_name"
                defaultValue={map.store_name || "GuardianTag Official Store"}
                required
                className="polaris-input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="polaris-form-group">
                <label className="polaris-label">Customer Support Email</label>
                <input
                  name="store_email"
                  defaultValue={map.store_email || "support@guardiantag.in"}
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">Store Currency</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="INR (₹) — Indian Rupee"
                  className="polaris-input"
                  style={{ backgroundColor: "#f1f2f4" }}
                />
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--shopify-border)", margin: "24px 0" }} />

        {/* Section 2: WhatsApp & Order Notifications */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>WhatsApp Orders Integration</div>
            <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 4 }}>
              Merchant alert phone number where checkout orders are directed.
            </div>
          </div>

          <div className="polaris-card">
            <div className="polaris-form-group">
              <label className="polaris-label">Merchant WhatsApp Mobile Number</label>
              <input
                name="whatsapp_number"
                defaultValue={map.whatsapp_number || "918058800880"}
                required
                className="polaris-input"
                style={{ fontWeight: 600 }}
              />
              <div className="polaris-help-text">
                Include country code without '+' (e.g. 918058800880 for +91 80588 00880).
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--shopify-border)", margin: "24px 0" }} />

        {/* Section 3: Taxes & GST */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Taxes &amp; GST</div>
            <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 4 }}>
              Goods &amp; Services Tax (GST) calculation and invoice credentials.
            </div>
          </div>

          <div className="polaris-card">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="polaris-form-group">
                <label className="polaris-label">GST Rate (%)</label>
                <input
                  name="tax_gst_percent"
                  type="number"
                  defaultValue={map.tax_gst_percent || "18"}
                  className="polaris-input"
                />
              </div>

              <div className="polaris-form-group">
                <label className="polaris-label">GSTIN / Tax ID Number</label>
                <input
                  name="gstin_number"
                  defaultValue={map.gstin_number || "08AAACG1234F1Z5"}
                  className="polaris-input"
                />
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--shopify-border)", margin: "24px 0" }} />

        {/* Section 4: Policies */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Store Policies</div>
            <div style={{ fontSize: 12.5, color: "var(--shopify-text-subdued)", marginTop: 4 }}>
              Terms shown to customers on storefront checkout.
            </div>
          </div>

          <div className="polaris-card">
            <div className="polaris-form-group">
              <label className="polaris-label">Refund &amp; Hardware Replacement Policy</label>
              <textarea
                name="policy_refund"
                rows={3}
                defaultValue={map.policy_refund || ""}
                className="polaris-textarea"
              />
            </div>

            <div className="polaris-form-group" style={{ marginBottom: 0 }}>
              <label className="polaris-label">Shipping &amp; Delivery Policy</label>
              <textarea
                name="policy_shipping"
                rows={3}
                defaultValue={map.policy_shipping || ""}
                className="polaris-textarea"
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 40 }}>
          <button type="submit" className="btn-polaris-primary" style={{ padding: "10px 24px", fontSize: 14 }}>
            Save Store Settings
          </button>
        </div>
      </form>
    </>
  );
}
