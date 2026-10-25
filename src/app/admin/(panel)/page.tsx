import Link from "next/link";
import { sql } from "@/lib/db";
import { inr, dt } from "@/lib/format";

export default async function Dashboard() {
  const [stats, low, tags, scans, recent] = await Promise.all([
    sql`SELECT
      count(*) FILTER (WHERE status = 'new')::int AS new_orders,
      count(*) FILTER (WHERE status IN ('new','packed'))::int AS to_ship,
      COALESCE(sum(total_paise) FILTER (WHERE payment_status = 'paid' AND status <> 'cancelled' AND created_at > now() - interval '30 days'), 0)::bigint AS rev30,
      COALESCE(sum(total_paise) FILTER (WHERE payment_status = 'unpaid' AND status <> 'cancelled'), 0)::bigint AS unpaid
      FROM store_orders`,
    sql`SELECT sku, name, stock, low_stock_at FROM store_products WHERE active AND stock <= low_stock_at ORDER BY stock LIMIT 8`,
    sql`SELECT status, count(*)::int AS n FROM qr_tags GROUP BY status ORDER BY status`,
    sql`SELECT qr_id, event_type, ip_address, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 8`,
    sql`SELECT id, order_no, customer_name, status, total_paise, created_at FROM store_orders ORDER BY created_at DESC LIMIT 6`,
  ]);
  const s = stats[0];
  return (
    <>
      <h1>Dashboard</h1>
      <div className="grid4">
        <div className="card stat"><b>{s.new_orders}</b><span>New orders</span></div>
        <div className="card stat"><b>{s.to_ship}</b><span>To pack / ship</span></div>
        <div className="card stat"><b>{inr(s.rev30)}</b><span>Paid, last 30 days</span></div>
        <div className="card stat"><b>{inr(s.unpaid)}</b><span>Awaiting payment</span></div>
      </div>
      <div className="grid2">
        <section className="card">
          <h2>Recent orders</h2>
          <table><tbody>
            {recent.map((o) => (
              <tr key={o.id}><td><Link href={`/admin/orders/${o.id}`}>{o.order_no}</Link></td><td>{o.customer_name}</td><td><span className={`pill ${o.status}`}>{o.status}</span></td><td>{inr(o.total_paise)}</td></tr>
            ))}
            {!recent.length && <tr><td className="muted">No orders yet. <Link href="/admin/orders/new">Create one</Link></td></tr>}
          </tbody></table>
        </section>
        <section className="card">
          <h2>Low stock</h2>
          <table><tbody>
            {low.map((p) => (<tr key={p.sku}><td>{p.name}</td><td className="muted">{p.sku}</td><td><span className="pill cancelled">{p.stock} left</span></td></tr>))}
            {!low.length && <tr><td className="muted">All good.</td></tr>}
          </tbody></table>
        </section>
        <section className="card">
          <h2>QR tags by status</h2>
          <table><tbody>{tags.map((t) => (<tr key={t.status}><td>{t.status}</td><td>{t.n}</td></tr>))}</tbody></table>
        </section>
        <section className="card">
          <h2>Recent scans</h2>
          <table><tbody>
            {scans.map((a, i) => (<tr key={i}><td>{a.qr_id}</td><td>{a.event_type}</td><td className="muted">{dt(a.created_at)}</td></tr>))}
            {!scans.length && <tr><td className="muted">No scan events logged yet.</td></tr>}
          </tbody></table>
        </section>
      </div>
    </>
  );
}
