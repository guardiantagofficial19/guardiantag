-- Auth state that must survive across serverless instances (was in-memory before).
-- Additive only. Safe to re-run.

-- One-time codes for owner login / registration phone checks. Only a keyed hash of the code is stored.
CREATE TABLE IF NOT EXISTS owner_otps (
  otp_key    text PRIMARY KEY,              -- 'login:<QR ID>' or 'reg:<+91 mobile>'
  code_hash  text NOT NULL,
  expires_at timestamptz NOT NULL,
  issued_at  timestamptz NOT NULL DEFAULT now(),
  attempts   integer NOT NULL DEFAULT 0
);

-- Fixed-window counters (e.g. OTP sends per IP / per phone).
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket   text PRIMARY KEY,
  hits     integer NOT NULL,
  reset_at timestamptz NOT NULL
);

-- Failed PIN/OTP login tracking: one row per (tag, IP), plus an ip_address = '*' row per tag
-- that counts failures from all IPs together.
CREATE UNIQUE INDEX IF NOT EXISTS tag_auth_locks_qr_ip_key ON tag_auth_locks (qr_id, ip_address);
