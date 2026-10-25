import { sql } from "@/lib/db";
import { inr, dt, TAG_TYPES } from "@/lib/format";
import { adjustStockAction, createProductAction, updateProductAction } from "../../actions";

export default async function Inventory({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const [products, moves] = await Promise.all([
    sql`SELECT * FROM store_products ORDER BY tag_type, sku`,
    sql`SELECT m.*, p.name FROM stock_movements m JOIN store_products p USING (sku) ORDER BY m.created_at DESC LIMIT 15`,
  ]);
  return (
    <>
      <h1>Inventory</h1>
      {error && <p className="err">{error}</p>}
      {products.map((p) => (
        <section key={p.sku} className="card">
          <div className="row">
            <h2>{p.name} <small className="muted">{p.sku}</small></h2>
            <span className={`pill ${p.stock <= p.low_stock_at ? "cancelled" : "delivered"}`}>{p.stock} in stock</span>
          </div>
          <div className="grid2">
            <form action={updateProductAction} className="form">
              <input type="hidden" name="sku" value={p.sku} />
              <label>Name<input name="name" defaultValue={p.name} required /></label>
              <label>Price (₹)<input name="price" type="number" step="0.01" min={0} defaultValue={p.price_paise / 100} /></label>
              <label>Low-stock alert at<input name="low_stock_at" type="number" min={0} defaultValue={p.low_stock_at} /></label>
              <label className="check"><input type="checkbox" name="active" defaultChecked={p.active} /> Active (sellable)</label>
              <button>Save</button>
            </form>
            <form action={adjustStockAction} className="form">
              <input type="hidden" name="sku" value={p.sku} />
              <label>Add / remove stock<input name="delta" type="number" placeholder="+50 or -3" required /></label>
              <label>Reason<input name="reason" placeholder="New batch from printer, damaged…" /></label>
              <button>Adjust stock</button>
            </form>
          </div>
        </section>
      ))}
      <section className="card">
        <h2>Add product</h2>
        <form action={createProductAction} className="form cols">
          <input name="sku" placeholder="SKU (e.g. GTB-KIT2)" required />
          <input name="name" placeholder="Name" required />
          <select name="tag_type">{TAG_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <input name="price" type="number" step="0.01" min={0} placeholder="Price ₹" required />
          <input name="stock" type="number" min={0} placeholder="Opening stock" defaultValue={0} />
          <button>Add</button>
        </form>
      </section>
      <section className="card">
        <h2>Recent stock movements</h2>
        <table><tbody>
          {moves.map((m) => (<tr key={m.id}><td>{m.name}</td><td className={m.delta > 0 ? "up" : "down"}>{m.delta > 0 ? `+${m.delta}` : m.delta}</td><td>{m.reason}</td><td className="muted">{dt(m.created_at)}</td></tr>))}
          {!moves.length && <tr><td className="muted">Nothing yet.</td></tr>}
        </tbody></table>
        <p className="muted">Prices shown in INR. Current example: {inr(49900)}.</p>
      </section>
    </>
  );
}
