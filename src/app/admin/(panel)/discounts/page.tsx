import { sql } from "@/lib/db";
import { inr } from "@/lib/format";
import {
  createDiscountAction,
  toggleDiscountAction,
  deleteDiscountAction,
} from "../../actions";
import ConfirmButton from "@/components/ConfirmButton";
import { Tag, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

type SP = { error?: string };

export default async function ShopifyDiscountsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const { error } = await searchParams;

  const discounts = await sql`
    SELECT * FROM store_discounts ORDER BY active DESC, created_at DESC
  `;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Discounts & Coupons</h1>
          <div className="page-subtitle">
            Create promotional coupon codes, percentage discounts, and free shipping triggers for customer checkouts.
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

      {/* Two Column Layout: Create Discount + Discounts List */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {/* Left Column: Create New Discount Code */}
        <div className="polaris-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: "1px solid var(--shopify-border)",
            }}
          >
            <Plus size={16} color="var(--shopify-green)" />
            <h2 style={{ margin: 0, fontSize: 14 }}>Create Discount Code</h2>
          </div>

          <form action={createDiscountAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="polaris-form-group">
              <label className="polaris-label">Discount Code</label>
              <input
                name="code"
                placeholder="e.g. FESTIVE20, BIKERCLUB"
                required
                style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}
                className="polaris-input"
              />
              <div className="polaris-help-text">Customers will enter this code at checkout.</div>
            </div>

            <div className="polaris-form-group">
              <label className="polaris-label">Discount Type</label>
              <select name="discount_type" className="polaris-select">
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed_amount">Fixed Amount Off (₹)</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>

            <div className="polaris-form-group">
              <label className="polaris-label">Discount Value (e.g. 10 for 10% or ₹100)</label>
              <input
                name="value"
                type="number"
                min={0}
                defaultValue={10}
                required
                className="polaris-input"
              />
            </div>

            <div className="polaris-form-group">
              <label className="polaris-label">Minimum Purchase Amount (₹)</label>
              <input
                name="min_spend"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="0 for no minimum"
                className="polaris-input"
              />
            </div>

            <div className="polaris-form-group">
              <label className="polaris-label">Maximum Total Uses (Optional)</label>
              <input
                name="max_uses"
                type="number"
                min={1}
                placeholder="e.g. 500 uses (leave blank for unlimited)"
                className="polaris-input"
              />
            </div>

            <button type="submit" className="btn-polaris-primary" style={{ marginTop: 6 }}>
              Save Discount Code
            </button>
          </form>
        </div>

        {/* Right Column: Existing Discounts Table */}
        <div className="polaris-card flush">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--shopify-border)" }}>
            <h2 style={{ margin: 0, fontSize: 14 }}>Active Promotional Codes ({discounts.length})</h2>
          </div>

          <table className="polaris-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Status</th>
                <th>Type & Value</th>
                <th>Min Spend</th>
                <th>Usage</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => {
                let displayVal = `${d.value}% OFF`;
                if (d.discount_type === "fixed_amount") {
                  displayVal = `₹${d.value} OFF`;
                } else if (d.discount_type === "free_shipping") {
                  displayVal = "FREE SHIPPING";
                }

                return (
                  <tr key={d.id}>
                    <td>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13.5,
                          letterSpacing: 0.5,
                          color: "var(--shopify-green)",
                        }}
                      >
                        {d.code}
                      </div>
                    </td>
                    <td>
                      <span className={`polaris-badge ${d.active ? "active" : "draft"}`}>
                        {d.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{displayVal}</div>
                    </td>
                    <td>
                      {d.min_spend_paise > 0 ? inr(d.min_spend_paise) : "No minimum"}
                    </td>
                    <td>
                      <span style={{ fontSize: 12.5, fontWeight: 500 }}>
                        {d.usage_count} {d.max_uses ? `/ ${d.max_uses}` : "used"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <form action={toggleDiscountAction}>
                          <input type="hidden" name="id" value={d.id} />
                          <input type="hidden" name="active" value={String(d.active)} />
                          <button
                            type="submit"
                            className="btn-polaris-secondary"
                            style={{ padding: "4px 8px", fontSize: 11.5 }}
                          >
                            {d.active ? "Disable" : "Enable"}
                          </button>
                        </form>

                        <form action={deleteDiscountAction}>
                          <input type="hidden" name="id" value={d.id} />
                          <ConfirmButton
                            message={`Delete discount code ${d.code}?`}
                            className="btn-polaris-danger"
                            style={{ padding: "4px 8px", fontSize: 11.5 }}
                          >
                            Delete
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!discounts.length && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--shopify-text-subdued)" }}>
                    <Tag size={32} style={{ margin: "0 auto 8px", opacity: 0.4, display: "block" }} />
                    No discount codes created yet.
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
