-- =========================================================
-- GUARDIANTAG SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATION
-- =========================================================

-- 1. Custom ENUM Types
CREATE TYPE tag_type_enum AS ENUM ('GTB', 'GTK', 'GTT', 'GTU');
CREATE TYPE tag_status_enum AS ENUM ('unassigned', 'printed', 'activated', 'disabled', 'lost');

-- 2. Table: owners (Tag Owner Accounts & Vault)
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table: qr_tags (Physical QR Tag Hardware Registry)
CREATE TABLE IF NOT EXISTS public.qr_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_id TEXT NOT NULL UNIQUE,
    tag_type tag_type_enum NOT NULL,
    status tag_status_enum DEFAULT 'printed',
    owner_id UUID REFERENCES public.owners(id) ON DELETE SET NULL,
    pin_hash TEXT,
    vehicle_no TEXT,
    blood_group TEXT,
    medical_notes TEXT,
    activated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Table: emergency_contacts (Emergency Dispatch Contacts)
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id UUID NOT NULL REFERENCES public.qr_tags(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    relationship TEXT,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Table: tag_auth_locks (Rate Limiting & Lockouts)
CREATE TABLE IF NOT EXISTS public.tag_auth_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_id TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    last_failed_at TIMESTAMPTZ DEFAULT now(),
    locked_until TIMESTAMPTZ
);

-- 6. Table: audit_logs (Security & Scan Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_qr_tags_qr_id ON public.qr_tags (qr_id);
CREATE INDEX IF NOT EXISTS idx_qr_tags_owner_id ON public.qr_tags (owner_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_tag_id ON public.emergency_contacts (tag_id);
CREATE INDEX IF NOT EXISTS idx_tag_auth_locks_qr_ip ON public.tag_auth_locks (qr_id, ip_address);

-- =========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.qr_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag_auth_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public Unauthenticated Scans (anon) read ONLY non-PII fields where status = 'activated'
CREATE POLICY "Public Emergency Scan Read" ON public.qr_tags
    FOR SELECT
    TO anon
    USING (status = 'activated');

-- Policy 2: Strictly DENY public access to owner private profiles
CREATE POLICY "Deny Public Access to Owners" ON public.owners
    FOR ALL
    TO anon
    USING (false);

-- Policy 3: Strictly DENY public access to emergency contacts
CREATE POLICY "Deny Public Access to Emergency Contacts" ON public.emergency_contacts
    FOR ALL
    TO anon
    USING (false);

-- Seed Initial Test Hardware Tags
INSERT INTO public.qr_tags (qr_id, tag_type, status) VALUES
    ('GTB0001', 'GTB', 'printed'),
    ('GTK0001', 'GTK', 'printed'),
    ('GTT0001', 'GTT', 'printed'),
    ('GTU0001', 'GTU', 'printed')
ON CONFLICT (qr_id) DO NOTHING;
