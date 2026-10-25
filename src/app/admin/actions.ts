"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { COOKIE, createToken, safeEqual } from "@/lib/admin-auth";
import { requireAdmin } from "@/lib/admin-guard";
import { ORDER_STATUSES, PAYMENT_STATUSES, TAG_TYPES } from "@/lib/format";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const n = Math.trunc(Number(fd.get(k)));
  return Number.isFinite(n) ? n : 0;
};
const paise = (fd: FormData, k: string) => Math.round(Number(fd.get(k) || 0) * 100);

/* ---------- auth ---------- */
export async function loginAction(fd: FormData) {
  const pw = str(fd, "password");
  const expected = (process.env.ADMIN_PASSWORD || "guardiantag_admin_2026!").trim();
  if (!safeEqual(pw, expected) && pw !== expected) {
    await new Promise((r) => setTimeout(r, 600));
    redirect("/admin/login?error=1");
  }
  (await cookies()).set(COOKIE, await createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete({ name: COOKIE, path: "/" });
  redirect("/admin/login");
}

/* ---------- inventory ---------- */
export async function createProductAction(fd: FormData) {
  await requireAdmin();
  const sku = str(fd, "sku").toUpperCase();
  const name = str(fd, "name");
  const type = str(fd, "tag_type");
  if (!sku || !name || !(TAG_TYPES as readonly string[]).includes(type)) redirect("/admin/inventory?error=Invalid+product");
  let err = "";
  try {
    await sql.transaction([
      sql`INSERT INTO store_products (sku, name, tag_type, price_paise, stock) VALUES (${sku}, ${name}, ${type}, ${paise(fd, "price")}, ${Math.max(0, num(fd, "stock"))})`,
      sql`INSERT INTO stock_movements (sku, delta, reason) SELECT sku, stock, 'initial' FROM store_products WHERE sku = ${sku} AND stock > 0`,
    ]);
  } catch { err = "SKU already exists"; }
  revalidatePath("/admin/inventory");
  redirect(err ? `/admin/inventory?error=${encodeURIComponent(err)}` : "/admin/inventory");
}

export async function updateProductAction(fd: FormData) {
  await requireAdmin();
  await sql`UPDATE store_products SET name = ${str(fd, "name")}, price_paise = ${paise(fd, "price")},
    low_stock_at = ${Math.max(0, num(fd, "low_stock_at"))}, active = ${fd.get("active") === "on"} WHERE sku = ${str(fd, "sku")}`;
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/inventory");
}

export async function updateFullProductAction(fd: FormData) {
  await requireAdmin();
  const sku = str(fd, "sku");
  const name = str(fd, "name");
  const type = str(fd, "tag_type");
  const subtitle = str(fd, "subtitle");
  const category = str(fd, "category");
  const ratingText = str(fd, "rating_text");
  const description = str(fd, "description");
  const features = str(fd, "features");
  let imageUrl = str(fd, "image_url");

  // Handle direct file upload if provided
  const file = fd.get("image_file") as File | null;
  if (file && typeof file === "object" && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mime = file.type || "image/png";
      imageUrl = `data:${mime};base64,${base64}`;
    } catch {
      // Keep existing imageUrl if conversion fails
    }
  }

  await sql`
    UPDATE store_products 
    SET 
      name = ${name},
      tag_type = ${type},
      price_paise = ${paise(fd, "price")},
      low_stock_at = ${Math.max(0, num(fd, "low_stock_at"))},
      active = ${fd.get("active") === "on"},
      subtitle = ${subtitle},
      category = ${category},
      rating_text = ${ratingText},
      description = ${description},
      features = ${features},
      image_url = ${imageUrl}
    WHERE sku = ${sku}
  `;

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${encodeURIComponent(sku)}`);
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  redirect(`/admin/products/${encodeURIComponent(sku)}?saved=1`);
}

export async function createFullProductAction(fd: FormData) {
  await requireAdmin();
  const sku = str(fd, "sku").toUpperCase().trim();
  const name = str(fd, "name").trim();
  const type = str(fd, "tag_type").toUpperCase().trim();
  const subtitle = str(fd, "subtitle");
  const category = str(fd, "category");
  const ratingText = str(fd, "rating_text");
  const description = str(fd, "description");
  const features = str(fd, "features");
  let imageUrl = str(fd, "image_url");

  if (!sku || !name) redirect("/admin/products/new?error=SKU+and+Name+are+required");

  const file = fd.get("image_file") as File | null;
  if (file && typeof file === "object" && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mime = file.type || "image/png";
      imageUrl = `data:${mime};base64,${base64}`;
    } catch {
      // fallback
    }
  }

  const initialStock = Math.max(0, num(fd, "stock"));
  let err = "";

  try {
    const stmts = [
      sql`
        INSERT INTO store_products (
          sku, name, tag_type, price_paise, stock, low_stock_at, active,
          subtitle, category, rating_text, description, features, image_url
        ) VALUES (
          ${sku}, ${name}, ${type}, ${paise(fd, "price")}, ${initialStock},
          ${Math.max(0, num(fd, "low_stock_at") || 10)}, ${fd.get("active") === "on"},
          ${subtitle}, ${category}, ${ratingText}, ${description}, ${features}, ${imageUrl}
        )
      `,
    ];
    if (initialStock > 0) {
      stmts.push(sql`INSERT INTO stock_movements (sku, delta, reason) VALUES (${sku}, ${initialStock}, 'initial_product_stock')`);
    }
    await sql.transaction(stmts);
  } catch (e: any) {
    err = e?.message || "SKU already exists";
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");

  if (err) {
    redirect(`/admin/products/new?error=${encodeURIComponent(err)}`);
  } else {
    redirect(`/admin/products/${encodeURIComponent(sku)}?saved=1`);
  }
}

export async function deleteProductAction(fd: FormData) {
  await requireAdmin();
  const sku = str(fd, "sku");
  try {
    await sql`UPDATE store_products SET active = false WHERE sku = ${sku}`;
  } catch {}
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function adjustStockAction(fd: FormData) {
  await requireAdmin();
  const sku = str(fd, "sku");
  const delta = num(fd, "delta");
  const reason = str(fd, "reason") || "manual adjustment";
  let err = "";
  if (delta !== 0) {
    try {
      await sql.transaction([
        sql`UPDATE store_products SET stock = stock + ${delta} WHERE sku = ${sku}`,
        sql`INSERT INTO stock_movements (sku, delta, reason) VALUES (${sku}, ${delta}, ${reason})`,
      ]);
    } catch { err = "Stock cannot go below zero"; }
  }
  revalidatePath("/admin/inventory");
  redirect(err ? `/admin/inventory?error=${encodeURIComponent(err)}` : "/admin/inventory");
}

/* ---------- orders ---------- */
export async function createOrderAction(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "customer_name");
  if (!name) redirect("/admin/orders/new?error=Customer+name+is+required");

  const products = await sql`SELECT sku, name, price_paise FROM store_products WHERE active = true`;
  const items = products
    .map((p) => ({ sku: p.sku as string, name: p.name as string, unit: Number(p.price_paise), qty: Math.max(0, num(fd, `qty_${p.sku}`)) }))
    .filter((i) => i.qty > 0);
  if (!items.length) redirect("/admin/orders/new?error=Add+at+least+one+item");

  const shipping = paise(fd, "shipping");
  const total = items.reduce((s, i) => s + i.unit * i.qty, 0) + shipping;
  const id = crypto.randomUUID();
  const payStatus = (PAYMENT_STATUSES as readonly string[]).includes(str(fd, "payment_status")) ? str(fd, "payment_status") : "unpaid";

  let orderNo = "";
  try {
    const stmts = [
      sql`INSERT INTO store_orders (id, customer_name, phone, email, address, city, state, pincode, payment_status, shipping_paise, total_paise, notes)
          VALUES (${id}, ${name}, ${str(fd, "phone")}, ${str(fd, "email")}, ${str(fd, "address")}, ${str(fd, "city")}, ${str(fd, "state")}, ${str(fd, "pincode")}, ${payStatus}, ${shipping}, ${total}, ${str(fd, "notes")})`,
      ...items.flatMap((i) => [
        sql`INSERT INTO store_order_items (order_id, sku, name, qty, unit_paise) VALUES (${id}, ${i.sku}, ${i.name}, ${i.qty}, ${i.unit})`,
        sql`UPDATE store_products SET stock = stock - ${i.qty} WHERE sku = ${i.sku}`,
        sql`INSERT INTO stock_movements (sku, delta, reason, order_id) VALUES (${i.sku}, ${-i.qty}, 'order', ${id})`,
      ]),
    ];
    await sql.transaction(stmts);
    orderNo = id;
  } catch {
    redirect("/admin/orders/new?error=Not+enough+stock+for+one+of+the+items");
  }
  revalidatePath("/admin", "layout");
  redirect(`/admin/orders/${orderNo}`);
}

export async function updateOrderAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const status = str(fd, "status");
  const pay = str(fd, "payment_status");
  if (!(ORDER_STATUSES as readonly string[]).includes(status) || !(PAYMENT_STATUSES as readonly string[]).includes(pay)) {
    redirect(`/admin/orders/${id}`);
  }
  if (status === "cancelled") {
    // Atomic: flips status once and restores stock exactly once.
    await sql`
      WITH c AS (UPDATE store_orders SET status = 'cancelled', updated_at = now() WHERE id = ${id} AND status <> 'cancelled' RETURNING id),
      r AS (UPDATE store_products p SET stock = p.stock + i.qty FROM store_order_items i, c WHERE i.order_id = c.id AND p.sku = i.sku RETURNING p.sku, i.qty)
      INSERT INTO stock_movements (sku, delta, reason, order_id) SELECT sku, qty, 'order_cancelled', ${id}::uuid FROM r`;
  } else {
    await sql`UPDATE store_orders SET status = ${status}, updated_at = now() WHERE id = ${id} AND status <> 'cancelled'`;
  }
  await sql`UPDATE store_orders SET payment_status = ${pay}, courier = ${str(fd, "courier")}, tracking_no = ${str(fd, "tracking_no")},
    notes = ${str(fd, "notes")}, updated_at = now() WHERE id = ${id}`;
  revalidatePath("/admin", "layout");
  redirect(`/admin/orders/${id}`);
}

/* ---------- tags ---------- */
export async function generateTagsAction(fd: FormData) {
  await requireAdmin();
  const type = str(fd, "type");
  const qty = Math.min(500, Math.max(1, num(fd, "qty")));
  if (!(TAG_TYPES as readonly string[]).includes(type)) redirect("/admin/tags?error=Invalid+type");
  let made = "";
  try {
    const rows = await sql`
      INSERT INTO qr_tags (qr_id, tag_type, status)
      SELECT ${type}::text || CASE WHEN base.m + g.n < 10000 THEN lpad((base.m + g.n)::text, 4, '0') ELSE (base.m + g.n)::text END, ${type}::text, 'printed'
      FROM (SELECT COALESCE(MAX(SUBSTRING(qr_id FROM 4)::int), 0) AS m FROM qr_tags WHERE tag_type = ${type}::text AND qr_id ~ ('^' || ${type}::text || '[0-9]+$')) base,
           generate_series(1, ${qty}::int) AS g(n)
      RETURNING qr_id`;
    made = `${rows.length} ${type} tags created (${rows[0]?.qr_id} to ${rows[rows.length - 1]?.qr_id})`;
  } catch {
    redirect("/admin/tags?error=Could+not+generate.+Try+again");
  }
  revalidatePath("/admin/tags");
  redirect(`/admin/tags?made=${encodeURIComponent(made)}`);
}

// Owner details for registered tags live in these tables (what the scan page reads).
const OWNER_TABLE: Record<string, string> = { GTB: "bikers", GTK: "kids", GTT: "travellers", GTU: "universals" };

export async function tagStatusAction(fd: FormData) {
  await requireAdmin();
  const qr = str(fd, "qr_id").toUpperCase();
  const act = str(fd, "act");
  const table = OWNER_TABLE[qr.slice(0, 3)];
  if (!table) redirect("/admin/tags?error=Unknown+tag+type");

  if (act === "disable") {
    await sql.transaction([
      sql`UPDATE qr_tags SET status = 'disabled', updated_at = now() WHERE qr_id = ${qr}`,
      sql.query(`UPDATE ${table} SET status = 'disabled', tag_active = false WHERE tag_id = $1`, [qr]),
    ]);
  } else if (act === "enable") {
    await sql.transaction([
      sql`UPDATE qr_tags SET status = CASE WHEN activated_at IS NULL THEN 'printed' ELSE 'activated' END, updated_at = now() WHERE qr_id = ${qr}`,
      sql.query(`UPDATE ${table} SET status = 'active', tag_active = true WHERE tag_id = $1 AND status = 'disabled'`, [qr]),
    ]);
  } else if (act === "reset") {
    // Erase the owner so the tag can be activated again (bike sold, lost PIN).
    await sql.transaction([
      sql`UPDATE qr_tags SET status = 'printed', owner_id = NULL, owner_name = NULL, owner_phone = NULL, emergency_name = NULL, emergency_phone = NULL,
          pin_hash = NULL, pin_salt = NULL, vehicle_no = NULL, blood_group = NULL, medical_notes = NULL, activated_at = NULL, updated_at = now() WHERE qr_id = ${qr}`,
      sql.query(`DELETE FROM ${table} WHERE tag_id = $1`, [qr]),
      sql`DELETE FROM tag_auth_locks WHERE qr_id = ${qr}`,
    ]);
  }
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}
