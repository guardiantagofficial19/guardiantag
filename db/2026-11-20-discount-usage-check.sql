-- A coupon can never be redeemed more than max_uses times, even under concurrent orders:
-- the order transaction increments usage_count and this constraint aborts it if the limit is passed.
-- (store_products already has CHECK (stock >= 0), which does the same for stock.)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'store_discounts_usage_within_max') THEN
    ALTER TABLE store_discounts
      ADD CONSTRAINT store_discounts_usage_within_max CHECK (max_uses IS NULL OR usage_count <= max_uses);
  END IF;
END $$
