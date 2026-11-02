import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';

if (!databaseUrl) {
  console.error('DATABASE_URL is missing in .env.local');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function runShopifyMigration() {
  console.log('Starting Shopify Store Manager database migration...');

  const statements = [
    // 1. Discounts Engine
    `CREATE TABLE IF NOT EXISTS store_discounts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      code text UNIQUE NOT NULL,
      discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping')),
      value integer NOT NULL DEFAULT 0,
      min_spend_paise integer NOT NULL DEFAULT 0,
      usage_count integer NOT NULL DEFAULT 0,
      max_uses integer,
      active boolean NOT NULL DEFAULT true,
      starts_at timestamptz NOT NULL DEFAULT now(),
      expires_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

    // 2. Collections / Categories
    `CREATE TABLE IF NOT EXISTS store_collections (
      id text PRIMARY KEY,
      title text NOT NULL,
      description text DEFAULT '',
      image_url text DEFAULT '',
      sort_order integer DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

    // 3. Abandoned Checkouts
    `CREATE TABLE IF NOT EXISTS store_abandoned_checkouts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_name text,
      phone text,
      email text,
      address text,
      items jsonb NOT NULL DEFAULT '[]'::jsonb,
      total_paise integer NOT NULL DEFAULT 0,
      recovered boolean NOT NULL DEFAULT false,
      recovery_sent_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

    // 4. Store Global Settings
    `CREATE TABLE IF NOT EXISTS store_settings (
      key text PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`,

    // 5. Enhance store_products with Shopify Polaris attributes
    `ALTER TABLE store_products ADD COLUMN IF NOT EXISTS compare_at_price_paise integer DEFAULT 0`,
    `ALTER TABLE store_products ADD COLUMN IF NOT EXISTS cost_per_item_paise integer DEFAULT 0`,
    `ALTER TABLE store_products ADD COLUMN IF NOT EXISTS barcode text DEFAULT ''`,
    `ALTER TABLE store_products ADD COLUMN IF NOT EXISTS vendor text DEFAULT 'GuardianTag Official'`,
    `ALTER TABLE store_products ADD COLUMN IF NOT EXISTS tags text DEFAULT ''`,
    `ALTER TABLE store_products ADD COLUMN IF NOT EXISTS collection_id text DEFAULT ''`,

    // 6. Seed Initial Discounts if none exist
    `INSERT INTO store_discounts (code, discount_type, value, min_spend_paise, max_uses, active) VALUES
      ('WELCOME10', 'percentage', 10, 0, 500, true),
      ('FREESHIP', 'free_shipping', 0, 0, NULL, true),
      ('FLAT50', 'fixed_amount', 5000, 49900, 200, true)
    ON CONFLICT (code) DO NOTHING`,

    // 7. Seed Collections
    `INSERT INTO store_collections (id, title, description, sort_order) VALUES
      ('bikers', 'Biker Safety & Helmet Kits', 'Ultra-rugged tamper-proof QR tags engineered for riders & superbikes.', 1),
      ('kids', 'Kids & School Bus Safety', 'Emergency guardian contact badges for uniforms, backpacks & smart watches.', 2),
      ('travel', 'Luggage & World Travel', 'Smart baggage & passport emergency recovery decals for frequent flyers.', 3),
      ('fleets', 'Corporate & Fleet Asset Tags', 'High-volume QR tracking hardware for logistics, syndicate fleets & assets.', 4)
    ON CONFLICT (id) DO NOTHING`,

    // 8. Seed default Store Settings
    `INSERT INTO store_settings (key, value) VALUES
      ('store_name', 'GuardianTag Official Store'),
      ('store_email', 'support@guardiantag.in'),
      ('currency', 'INR'),
      ('whatsapp_number', '918058800880'),
      ('free_shipping_threshold', '0'),
      ('standard_shipping_paise', '0'),
      ('tax_gst_percent', '18'),
      ('gstin_number', '08AAACG1234F1Z5'),
      ('policy_refund', 'GuardianTag items carry a 1-year hardware replacement guarantee. If damaged in transit or defective, free replacements are dispatched within 48 hours.'),
      ('policy_shipping', 'Free delivery across all 28 states & UTs in India via Delhivery / India Post speed post within 3-5 business days.')
    ON CONFLICT (key) DO NOTHING`
  ];

  for (let i = 0; i < statements.length; i++) {
    try {
      await sql.query(statements[i]);
      console.log(`✓ Executed migration step ${i + 1}/${statements.length}`);
    } catch (err) {
      console.error(`Error on step ${i + 1}:`, err);
    }
  }

  console.log('✅ Shopify Store Manager migration completed successfully!');
}

runShopifyMigration().catch(console.error);
