-- GuardianTag store manager: additive tables only. Safe to re-run.
CREATE TABLE IF NOT EXISTS store_products (
  sku text PRIMARY KEY,
  name text NOT NULL,
  tag_type text NOT NULL,
  price_paise integer NOT NULL CHECK (price_paise >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  low_stock_at integer NOT NULL DEFAULT 10,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL REFERENCES store_products(sku),
  delta integer NOT NULL,
  reason text NOT NULL,
  order_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS store_order_seq START 1001;

CREATE TABLE IF NOT EXISTS store_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no text UNIQUE NOT NULL DEFAULT ('GT-' || nextval('store_order_seq')::text),
  customer_name text NOT NULL,
  phone text,
  email text,
  address text,
  city text,
  state text,
  pincode text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','packed','shipped','delivered','cancelled')),
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded')),
  shipping_paise integer NOT NULL DEFAULT 0,
  total_paise integer NOT NULL DEFAULT 0,
  courier text,
  tracking_no text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  sku text NOT NULL REFERENCES store_products(sku),
  name text NOT NULL,
  qty integer NOT NULL CHECK (qty > 0),
  unit_paise integer NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_store_orders_status ON store_orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_order_items_order ON store_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_sku ON stock_movements(sku, created_at DESC);

-- Prices match the live /products page. Only the biker kit is on sale right now.
INSERT INTO store_products (sku, name, tag_type, price_paise, stock, active) VALUES
  ('GTB-KIT', 'GTB Biker Tag Kit (4-piece)', 'GTB', 49900, 0, true),
  ('GTK-KIT', 'GTK Kids Safety Bundle (10-piece)', 'GTK', 39900, 0, false),
  ('GTT-KIT', 'GTT Traveller Tag', 'GTT', 44900, 0, false),
  ('GTU-KIT', 'GTU Universal Decal', 'GTU', 29900, 0, false)
ON CONFLICT (sku) DO NOTHING;
