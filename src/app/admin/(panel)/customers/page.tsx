import Link from "next/link";
import { sql } from "@/lib/db";
import { inr, dt } from "@/lib/format";
import { Users, Search, MessageCircle, MapPin, Mail, Phone, ShoppingBag } from "lucide-react";

type SP = { q?: string };

export const dynamic = "force-dynamic";

export default async function ShopifyCustomersPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const { q } = await searchParams;
  const pat = q ? `%${q}%` : null;

  // Aggregate unique customer profiles from store_orders
  const customers = await sql`
    SELECT 
      phone,
      MAX(customer_name) as name,
      MAX(email) as email,
      MAX(address) as address,
      MAX(city) as city,
      MAX(state) as state,
      MAX(pincode) as pincode,
      COUNT(*)::int as orders_count,
      COALESCE(SUM(total_paise), 0)::bigint as total_spent_paise,
      MAX(created_at) as last_order_date
    FROM store_orders
    WHERE (${pat}::text IS NULL OR customer_name ILIKE ${pat}::text OR phone ILIKE ${pat}::text OR email ILIKE ${pat}::text OR city ILIKE ${pat}::text)
    GROUP BY phone
    ORDER BY last_order_date DESC
    LIMIT 200
  `;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <div className="page-subtitle">
            Customer directory, lifetime order history, and direct WhatsApp communication.
          </div>
        </div>
      </div>

      <div className="polaris-card flush">
        {/* Search Bar */}
        <div className="filter-bar-container">
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--shopify-text)" }}>
            {customers.length} {customers.length === 1 ? "Customer Profile" : "Customer Profiles"}
          </div>

          <form className="filter-search-form" method="GET">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by name, phone, email, city..."
              className="filter-input"
            />
          </form>
        </div>

        {/* Customers Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="polaris-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th style={{ textAlign: "right" }}>WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => {
                const waUrl = `https://wa.me/91${c.phone.replace(/[^0-9]/g, "").slice(-10)}?text=${encodeURIComponent(`Hi ${c.name}, greetings from GuardianTag!`)}`;

                return (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--shopify-text)" }}>{c.name}</div>
                      {c.orders_count > 1 && (
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: "#0284c7",
                            backgroundColor: "#e0f2fe",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          Repeat Customer ({c.orders_count}x)
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Phone size={12} color="var(--shopify-text-subdued)" />
                        <span>{c.phone}</span>
                      </div>
                      {c.email && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 11.5,
                            color: "var(--shopify-text-subdued)",
                            marginTop: 2,
                          }}
                        >
                          <Mail size={11} />
                          <span>{c.email}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} color="var(--shopify-text-subdued)" />
                        <span>{c.city || "India"} {c.state ? `, ${c.state}` : ""}</span>
                      </div>
                      {c.pincode && (
                        <div style={{ fontSize: 11, color: "var(--shopify-text-subdued)" }}>
                          PIN: {c.pincode}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <span className="polaris-badge neutral">
                        {c.orders_count} {c.orders_count === 1 ? "order" : "orders"}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--shopify-green)" }}>
                      {inr(c.total_spent_paise)}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--shopify-text-subdued)" }}>
                      {dt(c.last_order_date)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-polaris-whatsapp"
                      >
                        <MessageCircle size={13} />
                        <span>Message</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
              {!customers.length && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px 16px", color: "var(--shopify-text-subdued)" }}>
                    <Users size={36} style={{ margin: "0 auto 10px", opacity: 0.4, display: "block" }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--shopify-text)" }}>
                      No customers found
                    </div>
                    <div style={{ fontSize: 12.5, marginTop: 4 }}>
                      Customer profiles will automatically appear here as orders are placed on your online store.
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
