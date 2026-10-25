import { sql } from "@/lib/db";
import { inr, PAYMENT_STATUSES } from "@/lib/format";
import { createOrderAction } from "../../../actions";

export default async function NewOrder({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const products = await sql`SELECT sku, name, price_paise, stock FROM store_products WHERE active ORDER BY sku`;
  return (
    <>
      <h1>New order</h1>
      <p className="muted">For WhatsApp, phone or manual orders. Stock is reserved when the order is saved.</p>
      {error && <p className="err">{error}</p>}
      <form action={createOrderAction} className="card form">
        <h2>Items</h2>
        {products.map((p) => (
          <label key={p.sku} className="line">
            <span>{p.name} <em>{inr(p.price_paise)}</em> <small className="muted">({p.stock} in stock)</small></span>
            <input type="number" min={0} max={p.stock} name={`qty_${p.sku}`} defaultValue={0} />
          </label>
        ))}
        <h2>Customer</h2>
        <div className="cols">
          <input name="customer_name" placeholder="Full name *" required />
          <input name="phone" placeholder="Phone" />
          <input name="email" placeholder="Email" type="email" />
          <input name="pincode" placeholder="Pincode" />
          <input name="city" placeholder="City" />
          <input name="state" placeholder="State" />
        </div>
        <textarea name="address" placeholder="Shipping address" rows={2} />
        <div className="cols">
          <input name="shipping" type="number" step="0.01" min={0} placeholder="Shipping charge (₹)" defaultValue={0} />
          <select name="payment_status" defaultValue="unpaid">{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <textarea name="notes" placeholder="Internal notes" rows={2} />
        <button>Create order</button>
      </form>
    </>
  );
}
