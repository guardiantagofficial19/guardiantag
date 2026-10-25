import Link from "next/link";
import { sql } from "@/lib/db";
import { inr, dt, ORDER_STATUSES } from "@/lib/format";

type SP = { status?: string; q?: string };

export default async function Orders({ searchParams }: { searchParams: Promise<SP> }) {
  const { status, q } = await searchParams;
  const st = status && (ORDER_STATUSES as readonly string[]).includes(status) ? status : null;
  const pat = q ? `%${q}%` : null;
  const orders = await sql`
    SELECT id, order_no, customer_name, phone, status, payment_status, total_paise, created_at,
      (SELECT COALESCE(sum(qty),0)::int FROM store_order_items i WHERE i.order_id = o.id) AS units
    FROM store_orders o
    WHERE (${st}::text IS NULL OR status = ${st}::text)
      AND (${pat}::text IS NULL OR order_no ILIKE ${pat}::text OR customer_name ILIKE ${pat}::text OR phone ILIKE ${pat}::text OR tracking_no ILIKE ${pat}::text)
    ORDER BY created_at DESC LIMIT 200`;
  return (
    <>
      <div className="row"><h1>Orders</h1><Link className="btn" href="/admin/orders/new">+ New order</Link></div>
      <div className="tabs">
        <Link href="/admin/orders" className={!st ? "on" : ""}>All</Link>
        {ORDER_STATUSES.map((s) => (<Link key={s} href={`/admin/orders?status=${s}`} className={st === s ? "on" : ""}>{s}</Link>))}
        <form className="search"><input name="q" defaultValue={q} placeholder="Search order, name, phone, tracking" />{st && <input type="hidden" name="status" value={st} />}</form>
      </div>
      <div className="card scroll">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Units</th><th>Total</th><th>Payment</th><th>Status</th><th>Placed</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/admin/orders/${o.id}`}>{o.order_no}</Link></td>
                <td>{o.customer_name}<div className="muted">{o.phone}</div></td>
                <td>{o.units}</td><td>{inr(o.total_paise)}</td>
                <td><span className={`pill ${o.payment_status}`}>{o.payment_status}</span></td>
                <td><span className={`pill ${o.status}`}>{o.status}</span></td>
                <td className="muted">{dt(o.created_at)}</td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={7} className="muted">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
