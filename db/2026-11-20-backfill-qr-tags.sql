-- Backfill qr_tags from the owner tables so every registered tag is recorded as owned.
-- Registration now only claims qr_tags rows with status 'printed'; without this, tags registered
-- before the fix (owner row present, qr_tags still 'printed' or missing) could be claimed again.
-- Only rows still 'printed' (or missing) are touched. Safe to re-run.
BEGIN;

INSERT INTO qr_tags (qr_id, tag_type, status, owner_name, owner_phone, emergency_name, emergency_phone,
                     vehicle_no, blood_group, medical_notes, activated_at, updated_at)
SELECT m.tag_id, 'GTB', CASE WHEN m.status = 'disabled' THEN 'disabled' ELSE 'activated' END,
       m.owner_name, m.phone, m.emergency_contact_name, m.emergency_contact_phone,
       m.bike_model, m.blood_group, m.medical_notes, COALESCE(m.activated_at, m.registered_at, m.created_at, now()), now()
FROM bikers m WHERE m.tag_active IS TRUE OR m.owner_name IS NOT NULL
UNION ALL
SELECT m.tag_id, 'GTK', CASE WHEN m.status = 'disabled' THEN 'disabled' ELSE 'activated' END,
       m.owner_name, m.guardian_phone, m.emergency_contact_name, m.emergency_contact_phone,
       NULL, NULL, m.medical_notes, COALESCE(m.activated_at, m.registered_at, m.created_at, now()), now()
FROM kids m WHERE m.tag_active IS TRUE OR m.owner_name IS NOT NULL
UNION ALL
SELECT m.tag_id, 'GTT', CASE WHEN m.status = 'disabled' THEN 'disabled' ELSE 'activated' END,
       m.owner_name, m.phone, m.emergency_contact_name, m.emergency_contact_phone,
       m.passport_country, NULL, m.medical_notes, COALESCE(m.activated_at, m.registered_at, m.created_at, now()), now()
FROM travellers m WHERE m.tag_active IS TRUE OR m.owner_name IS NOT NULL
UNION ALL
SELECT m.tag_id, 'GTU', CASE WHEN m.status = 'disabled' THEN 'disabled' ELSE 'activated' END,
       m.owner_name, m.phone, m.emergency_contact_name, m.emergency_contact_phone,
       m.asset_name, NULL, m.medical_notes, COALESCE(m.activated_at, m.registered_at, m.created_at, now()), now()
FROM universals m WHERE m.tag_active IS TRUE OR m.owner_name IS NOT NULL
ON CONFLICT (qr_id) DO UPDATE SET
  status = EXCLUDED.status, owner_name = EXCLUDED.owner_name, owner_phone = EXCLUDED.owner_phone,
  emergency_name = EXCLUDED.emergency_name, emergency_phone = EXCLUDED.emergency_phone,
  vehicle_no = EXCLUDED.vehicle_no, blood_group = EXCLUDED.blood_group, medical_notes = EXCLUDED.medical_notes,
  activated_at = EXCLUDED.activated_at, updated_at = now()
WHERE qr_tags.status = 'printed';

COMMIT;
