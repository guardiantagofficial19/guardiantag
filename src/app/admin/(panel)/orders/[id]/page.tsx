import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { inr, dt, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/format";
import { updateOrderAction } from "../../../actions";
import ConfirmButton from "@/components/ConfirmButton";

const UUID = /^[0-9a-f-]{36}$/i;

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [o] = await sql`SELECT * FROM store_orders WHERE id = ${id}`;
  if (!o) notFound();
  const items = await sql`SELECT * FROM store_order_items WHERE order_id = ${id}`;
  const cancelled = o.status === "cancelled";
  return (
    <>
      <p><Link href="/admin/orders">← Orders</Link></p>
      <div className="row"><h1>{o.order_no}</h1><span className={`pill ${o.status}`}>{o.status}</span></div>
      <div className="grid2">
        <section className="card">
          <h2>Items</h2>
          <table>
            <tbody>
              {items.map((i) => (<tr key={i.id}><td>{i.name}<div className="muted">{i.sku}</div></td><td>× {i.qty}</td><td>{inr(i.unit_paise * i.qty)}</td></tr>))}
              <tr><td className="muted">Shipping</td><td></td><td>{inr(o.shipping_paise)}</td></tr>
              <tr><td><b>Total</b></td><td></td><td><b>{inr(o.total_paise)}</b></td></tr>
            </tbody>
          </table>
          <h2>Customer</h2>
          <p>{o.customer_name}<br />{o.phone} {o.email && `· ${o.email}`}<br />{o.address}<br />{[o.city, o.state, o.pincode].filter(Boolean).join(", ")}</p>
          <p className="muted">Placed {dt(o.created_at)} · Updated {dt(o.updated_at)}</p>
        </section>
        <section className="card">
          <h2>Fulfilment</h2>
          <form action={updateOrderAction} className="form">
            <input type="hidden" name="id" value={o.id} />
            <label>Status
              <select name="status" defaultValue={o.status} disabled={cancelled}>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              {cancelled && <input type="hidden" name="status" value="cancelled" />}
            </label>
            <label>Payment
              <select name="payment_status" defaultValue={o.payment_status}>{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            </label>
            <label>Courier<input name="courier" defaultValue={o.courier ?? ""} placeholder="India Post, Delhivery…" /></label>
            <label>Tracking no.<input name="tracking_no" defaultValue={o.tracking_no ?? ""} /></label>
            <label>Notes<textarea name="notes" rows={3} defaultValue={o.notes ?? ""} /></label>
            <ConfirmButton ifField={{ name: "status", value: "cancelled" }} message="Cancel this order? Stock will be returned and this cannot be undone.">Save changes</ConfirmButton>
          </form>
          <p className="muted">Setting status to <b>cancelled</b> returns the items to stock automatically.</p>
        </section>
      </div>
    </>
  );
}
