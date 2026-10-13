-- =========================================================
-- GUARDIANTAG COMPLETE NEON POSTGRESQL SCHEMA & DATA MIGRATION
-- Generated for Neon Project: org-noisy-heart-63214369
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table: bikers
CREATE TABLE IF NOT EXISTS public.bikers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id VARCHAR(50) UNIQUE NOT NULL,
    owner_name VARCHAR(255),
    phone VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    medical_notes TEXT,
    status VARCHAR(50) DEFAULT 'printed',
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    blood_group VARCHAR(10),
    bike_model VARCHAR(255),
    alert_preference VARCHAR(50),
    plan VARCHAR(50),
    token TEXT,
    tag_active BOOLEAN DEFAULT false,
    registered_at TIMESTAMPTZ
);

-- 2. Table: kids
CREATE TABLE IF NOT EXISTS public.kids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id VARCHAR(50) UNIQUE NOT NULL,
    owner_name VARCHAR(255),
    guardian_phone VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    medical_notes TEXT,
    status VARCHAR(50) DEFAULT 'printed',
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    plan VARCHAR(50),
    token TEXT,
    tag_active BOOLEAN DEFAULT false,
    registered_at TIMESTAMPTZ
);

-- 3. Table: travellers
CREATE TABLE IF NOT EXISTS public.travellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id VARCHAR(50) UNIQUE NOT NULL,
    owner_name VARCHAR(255),
    phone VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    medical_notes TEXT,
    passport_country VARCHAR(100),
    status VARCHAR(50) DEFAULT 'printed',
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    plan VARCHAR(50),
    token TEXT,
    tag_active BOOLEAN DEFAULT false,
    registered_at TIMESTAMPTZ
);

-- 4. Table: universals
CREATE TABLE IF NOT EXISTS public.universals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id VARCHAR(50) UNIQUE NOT NULL,
    owner_name VARCHAR(255),
    phone VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    medical_notes TEXT,
    asset_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'printed',
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    plan VARCHAR(50),
    token TEXT,
    tag_active BOOLEAN DEFAULT false,
    registered_at TIMESTAMPTZ
);

-- 5. Table: qr_tags (Master Hardware Directory)
CREATE TABLE IF NOT EXISTS public.qr_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_id VARCHAR(50) UNIQUE NOT NULL,
    tag_type VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'printed',
    owner_id UUID,
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    emergency_name VARCHAR(255),
    emergency_phone VARCHAR(50),
    pin_hash TEXT,
    pin_salt TEXT,
    vehicle_no VARCHAR(255),
    blood_group VARCHAR(10),
    medical_notes TEXT,
    activated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Table: owners
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Table: emergency_contacts
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id UUID REFERENCES public.qr_tags(id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(100),
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Table: tag_auth_locks
CREATE TABLE IF NOT EXISTS public.tag_auth_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_id VARCHAR(50) NOT NULL,
    ip_address VARCHAR(100) NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    last_failed_at TIMESTAMPTZ DEFAULT now(),
    locked_until TIMESTAMPTZ
);

-- 9. Table: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bikers_tag_id ON public.bikers(tag_id);
CREATE INDEX IF NOT EXISTS idx_kids_tag_id ON public.kids(tag_id);
CREATE INDEX IF NOT EXISTS idx_travellers_tag_id ON public.travellers(tag_id);
CREATE INDEX IF NOT EXISTS idx_universals_tag_id ON public.universals(tag_id);
CREATE INDEX IF NOT EXISTS idx_qr_tags_qr_id ON public.qr_tags(qr_id);

-- =========================================================
-- MIGRATE EXISTING DATA FROM SUPABASE
-- =========================================================

-- Seed / Migrate Bikers
INSERT INTO public.bikers (id, tag_id, owner_name, phone, emergency_contact_name, emergency_contact_phone, medical_notes, status, activated_at, expires_at, created_at, blood_group, bike_model, alert_preference, plan, tag_active, registered_at)
VALUES 
('40d60fe1-f888-46ac-810c-86ac9b99d561', 'GTB0001', 'Faim', '9024133338', 'harrry', '+919352253333', NULL, 'active', '2026-07-18 14:15:09.986577+00', '2026-10-16 14:15:09.986577+00', '2026-07-18 14:15:09.986577+00', 'O+', 'rc390`', 'both', 'promax', true, '2026-05-03 08:56:02.009+00'),
('d168ea28-f9e9-450a-b977-6fe449e8e59a', 'GTB0002', 'Mohammad Faim', '9024133338', 'Mohammad Faim', '09024133338', NULL, 'trial', '2026-07-18 18:34:09.484369+00', '2026-10-16 18:34:09.484369+00', '2026-07-18 18:34:09.484369+00', NULL, NULL, NULL, NULL, true, NULL),
('5b8e3439-be28-4ce9-8c38-1debcd30f915', 'GTB0099', 'Test Owner', '+919876543210', 'Test Emergency Contact', '+919123456789', 'No allergies', 'trial', '2026-10-10 14:18:00.044+00', '2027-01-08 14:18:01.096895+00', '2026-10-10 14:18:01.096895+00', 'O+', 'KA-01-AB-1234', NULL, NULL, true, '2026-10-10 14:18:00.044+00')
ON CONFLICT (tag_id) DO NOTHING;

-- Seed / Migrate Kids
INSERT INTO public.kids (id, tag_id, owner_name, guardian_phone, emergency_contact_name, emergency_contact_phone, medical_notes, status, activated_at, expires_at, created_at, plan, tag_active, registered_at)
VALUES 
('1fae72e8-0d99-4c51-a47b-acf014d80ef5', 'GTK0001', 'faim', '919024133338', 'harrry', '919352253333', NULL, 'active', '2026-07-18 14:15:09.986577+00', '2026-10-16 14:15:09.986577+00', '2026-07-18 14:15:09.986577+00', 'basic', true, '2026-05-03 09:00:44.922+00')
ON CONFLICT (tag_id) DO NOTHING;

-- Seed / Migrate Travellers
INSERT INTO public.travellers (id, tag_id, owner_name, phone, emergency_contact_name, emergency_contact_phone, medical_notes, passport_country, status, activated_at, expires_at, created_at, plan, tag_active, registered_at)
VALUES 
('1bdd6f52-7006-47dc-ac28-04dd0b2c36b5', 'GTT0001', 'Faim', '919024133338', 'harrry', '919352253333', NULL, NULL, 'active', '2026-07-18 14:15:09.986577+00', '2026-10-16 14:15:09.986577+00', '2026-07-18 14:15:09.986577+00', 'basic', true, '2026-05-03 09:03:39.853+00')
ON CONFLICT (tag_id) DO NOTHING;

-- Seed / Migrate Universals
INSERT INTO public.universals (id, tag_id, owner_name, phone, emergency_contact_name, emergency_contact_phone, medical_notes, asset_name, status, activated_at, expires_at, created_at, plan, tag_active, registered_at)
VALUES 
('72bfb746-df8d-4a0e-949b-0dfc906a4666', 'GTU0001', 'faim', '+919024133338', 'faim', '9929417788', NULL, NULL, 'trial', '2026-09-19 18:37:25.162+00', '2026-12-18 18:37:24.419726+00', '2026-09-19 18:37:24.419726+00', NULL, true, '2026-09-19 18:37:25.162+00')
ON CONFLICT (tag_id) DO NOTHING;

-- Seed / Migrate QR Tags Hardware
INSERT INTO public.qr_tags (id, qr_id, tag_type, status, created_at, updated_at)
VALUES 
('7fefd9b2-d13e-45d9-8d6d-9fc85efdc8e9', 'GTB0001', 'GTB', 'printed', '2026-08-14 05:39:57.89382+00', '2026-08-14 05:39:57.89382+00'),
('85d5c2af-a1f2-471d-afd8-585cd97e0297', 'GTK0001', 'GTK', 'printed', '2026-08-14 05:39:57.89382+00', '2026-08-14 05:39:57.89382+00'),
('eb4546b2-0d8f-4bf6-aee0-72fcaeda6141', 'GTT0001', 'GTT', 'printed', '2026-08-14 05:39:57.89382+00', '2026-08-14 05:39:57.89382+00'),
('368a32c4-7fa2-42a8-9b93-74a9bc615ecc', 'GTU0001', 'GTU', 'printed', '2026-08-14 05:39:57.89382+00', '2026-08-14 05:39:57.89382+00')
ON CONFLICT (qr_id) DO NOTHING;
