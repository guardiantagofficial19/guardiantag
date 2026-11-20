import { sql } from "@/lib/db";
import { inr, dt } from "@/lib/format";
import { recoverAbandonedCheckoutAction } from "../../../actions";
import Link from "next/link";
import { ShoppingCart, MessageCircle, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifyAbandonedCheckoutsPage() {
  const checkouts = await sql`
    SELECT * FROM store_abandoned_checkouts
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return (
    <>
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
          <span>All Orders</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1>Abandoned Checkouts</h1>
          <div className="page-subtitle">
            Customers who initiated checkout but didn&apos;t finish. Re-engage them with exclusive WhatsApp recovery offers.
          </div>
        </div>
      </div>

      <div className="polaris-card flush">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--shopify-border)" }}>
          <h2 style={{ margin: 0, fontSize: 14 }}>
            Uncompleted Checkouts ({checkouts.length})
          </h2>
        </div>

        <table className="polaris-table">
          <thead>
            <tr>
              <th>Checkout ID</th>
              <th>Customer</th>
              <th>Cart Value</th>
              <th>Status</th>
              <th>Abandoned At</th>
              <th style={{ textAlign: "right" }}>WhatsApp Recovery</th>
            </tr>
          </thead>
          <tbody>
            {checkouts.map((c) => {
              const phoneClean = (c.phone || "").replace(/[^0-9]/g, "").slice(-10);
              const recoveryMsg = `Hi ${c.customer_name || "there"}! We noticed you left items in your GuardianTag cart. Use code WELCOME10 for an extra 10% OFF if you order today: https://guardiantag.vercel.app/products`;
              const waUrl = `https://wa.me/91${phoneClean}?text=${encodeURIComponent(recoveryMsg)}`;

              return (
                <tr key={c.id}>
                  <td>
                    <code style={{ fontSize: 12 }}>#{c.id.slice(0, 8).toUpperCase()}</code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.customer_name || "Guest Shopper"}</div>
                    <div style={{ fontSize: 11.5, color: "var(--shopify-text-subdued)" }}>
                      {c.phone || "No phone entered"}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{inr(c.total_paise)}</td>
                  <td>
                    <span className={`polaris-badge ${c.recovered ? "active" : "unpaid"}`}>
                      {c.recovered ? "Recovered" : "Unrecovered"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--shopify-text-subdued)" }}>
                    {dt(c.created_at)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      {c.phone && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-polaris-whatsapp"
                        >
                          <MessageCircle size={13} />
                          <span>Recover via WhatsApp</span>
                        </a>
                      )}
                      {!c.recovered && (
                        <form action={recoverAbandonedCheckoutAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <button
                            type="submit"
                            className="btn-polaris-secondary"
                            style={{ padding: "5px 10px", fontSize: 12 }}
                          >
                            Mark Recovered
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!checkouts.length && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "var(--shopify-text-subdued)" }}>
                  <ShoppingCart size={36} style={{ margin: "0 auto 10px", opacity: 0.4, display: "block" }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--shopify-text)" }}>
                    No abandoned checkouts right now
                  </div>
                  <div style={{ fontSize: 12.5, marginTop: 4 }}>
                    Customers who drop off before completing their order will be captured here automatically.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
