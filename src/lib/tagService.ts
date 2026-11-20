import { hashPin } from './security/pinHash';
import { TagType, TagStatus } from './types';
import { sql } from '@/lib/db';

/*
 * Tag + owner data lives in Neon:
 *  - qr_tags: the inventory of issued tag IDs and the owner's login data (PIN hash, phones).
 *  - bikers / kids / travellers / universals: what the public scan page and Twilio read.
 * Every function here fails closed: a database error is thrown, never treated as "not found".
 */

export interface TagScanEvent {
  timestamp: string;
  lat: number;
  lng: number;
  locationName: string;
  deviceInfo: string;
}

export interface QrTagRecord {
  id: string;
  qrId: string;
  tagType: TagType;
  status: TagStatus;
  ownerId?: string;
  pinHash?: string;
  pinSalt?: string;
  ownerName?: string;
  ownerPhone?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  vehicleNo?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  activatedAt?: string;
  scanHistory?: TagScanEvent[];
  createdAt?: string;
  updatedAt?: string;
}

/** Owner-detail table per tag prefix. Table/column names are fixed here, never taken from input. */
const OWNER_TABLES: Record<TagType, { table: string; phoneCol: string; extraCol?: string }> = {
  GTB: { table: 'bikers', phoneCol: 'phone', extraCol: 'bike_model' },
  GTK: { table: 'kids', phoneCol: 'guardian_phone' },
  GTT: { table: 'travellers', phoneCol: 'phone', extraCol: 'passport_country' },
  GTU: { table: 'universals', phoneCol: 'phone', extraCol: 'asset_name' },
};

const TAG_ID_RE = /^(GTB|GTK|GTT|GTU)[0-9]{4,8}$/;

/** Returns the upper-cased tag ID if it is well-formed, else null. */
export function normalizeTagId(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const id = raw.trim().toUpperCase();
  return TAG_ID_RE.test(id) ? id : null;
}

function ownerTableFor(qrId: string) {
  return OWNER_TABLES[qrId.slice(0, 3) as TagType];
}

/** Statuses in which an owner has claimed the tag (and may log in to manage it). */
const OWNED_STATUSES = ['activated', 'active', 'deactivated', 'stolen'];

type Row = Record<string, unknown>;
const s = (v: unknown) => (v === null || v === undefined ? undefined : String(v));

function rowToRecord(r: Row): QrTagRecord {
  return {
    id: String(r.id),
    qrId: String(r.qr_id),
    tagType: String(r.tag_type) as TagType,
    status: String(r.status) as TagStatus,
    pinHash: s(r.pin_hash),
    pinSalt: s(r.pin_salt),
    ownerName: s(r.owner_name),
    ownerPhone: s(r.owner_phone),
    emergencyName: s(r.emergency_name),
    emergencyPhone: s(r.emergency_phone),
    vehicleNo: s(r.vehicle_no),
    bloodGroup: s(r.blood_group),
    medicalNotes: s(r.medical_notes),
    activatedAt: s(r.activated_at),
    createdAt: s(r.created_at),
    updatedAt: s(r.updated_at),
  };
}

/** Reads a tag (with owner login data) from qr_tags. Server-only: includes the PIN hash. */
export async function getTagRecord(rawQrId: string): Promise<QrTagRecord | null> {
  const qrId = normalizeTagId(rawQrId);
  if (!qrId) return null;
  const rows = await sql`SELECT * FROM qr_tags WHERE qr_id = ${qrId} LIMIT 1`;
  return rows[0] ? rowToRecord(rows[0]) : null;
}

/** True if this tag has an owner, by qr_tags status or by a legacy owner-table row. */
export function isOwnedStatus(status?: string): boolean {
  return !!status && OWNED_STATUSES.includes(status);
}

/**
 * SERVER-SIDE: may this QR ID be registered? Only IDs issued into qr_tags (status 'printed')
 * and not already claimed in the owner tables qualify.
 */
export async function validateQrIdServer(rawQrId: string): Promise<{
  success: boolean;
  tag?: QrTagRecord;
  error?: string;
  isAlreadyRegistered?: boolean;
}> {
  const qrId = normalizeTagId(rawQrId);
  if (!qrId) {
    return { success: false, error: 'Invalid QR Tag ID. It must look like GTB0001 (GTB, GTK, GTT or GTU followed by digits).' };
  }

  const tag = await getTagRecord(qrId);
  if (!tag) {
    return { success: false, error: `Tag ID ${qrId} was not found. Check the ID printed on your tag.` };
  }
  if (tag.status === 'disabled') {
    return { success: false, error: `Tag ${qrId} has been disabled. Please contact GuardianTag support.` };
  }

  const { table } = ownerTableFor(qrId);
  const legacy = await sql.query(
    `SELECT 1 FROM ${table} WHERE tag_id = $1 AND (tag_active IS TRUE OR owner_name IS NOT NULL) LIMIT 1`,
    [qrId]
  );
  if (tag.status !== 'printed' || legacy.length > 0) {
    return { success: false, isAlreadyRegistered: true, error: `Tag ID ${qrId} is already registered to an owner.` };
  }

  return { success: true, tag };
}

export interface RegisterPayload {
  qrId: string;
  pin: string;
  ownerName: string;
  ownerPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  vehicleNo?: string;
  bloodGroup?: string;
  medicalNotes?: string;
}

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * SERVER-SIDE: claims an issued tag for an owner. The claim is a single transaction whose
 * UPDATE only matches a still-unclaimed tag, so two registrations can never both win and an
 * owned tag can never be overwritten.
 */
export async function registerTagServer(payload: RegisterPayload): Promise<{
  success: boolean;
  activatedAt?: string;
  error?: string;
}> {
  const qrId = normalizeTagId(payload.qrId);
  if (!qrId) return { success: false, error: 'A valid QR Tag ID is required.' };

  if (typeof payload.pin !== 'string' || !/^\d{4}$/.test(payload.pin)) {
    return { success: false, error: 'PIN must be exactly 4 numeric digits.' };
  }

  const ownerName = clip(payload.ownerName, 100);
  const ownerPhone = clip(payload.ownerPhone, 20);
  const emergencyName = clip(payload.emergencyName, 100);
  const emergencyPhone = clip(payload.emergencyPhone, 20);
  if (!ownerName || !ownerPhone) return { success: false, error: 'Owner Name and Mobile Number are required.' };
  if (!emergencyName || !emergencyPhone) return { success: false, error: 'Emergency Contact Name and Mobile Number are required.' };

  const vehicleNo = clip(payload.vehicleNo, 60) || null;
  const bloodGroup = clip(payload.bloodGroup, 10) || null;
  const medicalNotes = clip(payload.medicalNotes, 500) || null;

  const { table, phoneCol, extraCol } = ownerTableFor(qrId);
  const { hash, salt } = hashPin(payload.pin);
  const activatedAt = new Date().toISOString();

  // Owner-table row, inserted only if the qr_tags claim in the same transaction succeeded.
  // Explicit casts: Postgres cannot infer parameter types inside INSERT ... SELECT.
  const cols = ['tag_id', 'owner_name', phoneCol, 'emergency_contact_name', 'emergency_contact_phone', 'medical_notes', 'status', 'tag_active', 'activated_at', 'registered_at'];
  const casts = ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'boolean', 'timestamptz', 'timestamptz'];
  const vals: unknown[] = [qrId, ownerName, ownerPhone, emergencyName, emergencyPhone, medicalNotes, 'trial', true, activatedAt, activatedAt];
  if (extraCol) { cols.push(extraCol); casts.push('text'); vals.push(vehicleNo); }
  if (table === 'bikers') { cols.push('blood_group'); casts.push('text'); vals.push(bloodGroup); }
  const hashParam = vals.length + 1;
  const placeholders = vals.map((_, i) => `$${i + 1}::${casts[i]}`).join(', ');
  const updates = cols.filter((c) => c !== 'tag_id').map((c) => `${c} = EXCLUDED.${c}`).join(', ');

  const [claimed] = await sql.transaction([
    sql.query(
      `UPDATE qr_tags SET status = 'activated', pin_hash = $2::text, pin_salt = $3::text, owner_name = $4::text, owner_phone = $5::text,
         emergency_name = $6::text, emergency_phone = $7::text, vehicle_no = $8::text, blood_group = $9::text, medical_notes = $10::text,
         activated_at = $11::timestamptz, updated_at = now()
       WHERE qr_id = $1::text AND status = 'printed'
         AND NOT EXISTS (SELECT 1 FROM ${table} WHERE tag_id = $1::text AND (tag_active IS TRUE OR owner_name IS NOT NULL))
       RETURNING qr_id`,
      [qrId, hash, salt, ownerName, ownerPhone, emergencyName, emergencyPhone, vehicleNo, bloodGroup, medicalNotes, activatedAt]
    ),
    sql.query(
      `INSERT INTO ${table} (${cols.join(', ')})
       SELECT ${placeholders}
       WHERE EXISTS (SELECT 1 FROM qr_tags WHERE qr_id = $1::text AND pin_hash = $${hashParam}::text)
       ON CONFLICT (tag_id) DO UPDATE SET ${updates}`,
      [...vals, hash]
    ),
  ]);

  if (!Array.isArray(claimed) || claimed.length === 0) {
    const check = await validateQrIdServer(qrId);
    return { success: false, error: check.error || `Tag ${qrId} could not be registered.` };
  }

  return { success: true, activatedAt };
}

export interface OwnerUpdate {
  ownerName: string;
  ownerPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  vehicleNo?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  /** 'deactivated' pauses the tag (scans show nothing); 'activated' turns it back on. */
  status?: 'activated' | 'deactivated';
}

/** SERVER-SIDE: updates an owned tag in qr_tags and its owner-table row in one transaction. */
export async function updateOwnerDetails(
  rawQrId: string,
  details: OwnerUpdate,
  newPin?: string
): Promise<{ success: boolean; error?: string; tag?: QrTagRecord }> {
  const qrId = normalizeTagId(rawQrId);
  if (!qrId) return { success: false, error: 'Invalid QR Tag ID.' };

  let hash: string | null = null;
  let salt: string | null = null;
  if (newPin) {
    if (!/^\d{4}$/.test(newPin)) return { success: false, error: 'New PIN must be exactly 4 numeric digits.' };
    ({ hash, salt } = hashPin(newPin));
  }

  const ownerName = clip(details.ownerName, 100);
  const ownerPhone = clip(details.ownerPhone, 20);
  const emergencyName = clip(details.emergencyName, 100);
  const emergencyPhone = clip(details.emergencyPhone, 20);
  const vehicleNo = clip(details.vehicleNo, 60) || null;
  const bloodGroup = clip(details.bloodGroup, 10) || null;
  const medicalNotes = clip(details.medicalNotes, 500) || null;
  const status = details.status === 'activated' || details.status === 'deactivated' ? details.status : null;

  const { table, phoneCol, extraCol } = ownerTableFor(qrId);
  const ownerSets = [
    'owner_name = $2::text', `${phoneCol} = $3::text`, 'emergency_contact_name = $4::text', 'emergency_contact_phone = $5::text', 'medical_notes = $6::text',
    "tag_active = CASE WHEN $7::text = 'deactivated' THEN false WHEN $7::text = 'activated' THEN true ELSE tag_active END",
  ];
  const ownerVals: unknown[] = [qrId, ownerName, ownerPhone, emergencyName, emergencyPhone, medicalNotes, status];
  if (extraCol) { ownerVals.push(vehicleNo); ownerSets.push(`${extraCol} = $${ownerVals.length}::text`); }
  if (table === 'bikers') { ownerVals.push(bloodGroup); ownerSets.push(`blood_group = $${ownerVals.length}::text`); }

  // Admin-disabled tags stay disabled: neither statement matches them.
  const [updated] = await sql.transaction([
    sql`UPDATE qr_tags SET owner_name = ${ownerName}, owner_phone = ${ownerPhone}, emergency_name = ${emergencyName},
          emergency_phone = ${emergencyPhone}, vehicle_no = ${vehicleNo}, blood_group = ${bloodGroup}, medical_notes = ${medicalNotes},
          pin_hash = COALESCE(${hash}::text, pin_hash), pin_salt = COALESCE(${salt}::text, pin_salt),
          status = COALESCE(${status}::text, status), updated_at = now()
        WHERE qr_id = ${qrId} AND status = ANY(${OWNED_STATUSES}::text[])
        RETURNING *`,
    sql.query(
      `UPDATE ${table} SET ${ownerSets.join(', ')}
       WHERE tag_id = $1::text AND status IS DISTINCT FROM 'disabled'
         AND EXISTS (SELECT 1 FROM qr_tags WHERE qr_id = $1::text AND status = ANY($${ownerVals.length + 1}::text[]))`,
      [...ownerVals, OWNED_STATUSES]
    ),
  ]);

  if (!Array.isArray(updated) || updated.length === 0) {
    return { success: false, error: 'This tag is not registered or has been disabled.' };
  }
  return { success: true, tag: rowToRecord(updated[0] as Row) };
}

/** Owner-table row for scans: only tags that are switched on and not disabled. */
async function getActiveOwnerRow(qrId: string): Promise<Row | null> {
  const { table } = ownerTableFor(qrId);
  const rows = await sql.query(
    `SELECT * FROM ${table} WHERE tag_id = $1 AND tag_active IS TRUE AND status IS DISTINCT FROM 'disabled' LIMIT 1`,
    [qrId]
  );
  return (rows[0] as Row) ?? null;
}

/**
 * PUBLIC SCAN LOOKUP (Zero-PII Exposure Rules)
 */
export async function getPublicTagInfo(rawQrId: string): Promise<{
  found: boolean;
  tag?: {
    qrId: string;
    tagType: string;
    status: string;
    vehicleNo?: string;
    bloodGroup?: string;
    medicalNotes?: string;
  };
}> {
  const qrId = normalizeTagId(rawQrId);
  if (!qrId) return { found: false };
  const row = await getActiveOwnerRow(qrId);
  if (!row) return { found: false };
  const { extraCol } = ownerTableFor(qrId);
  return {
    found: true,
    tag: {
      qrId,
      tagType: qrId.slice(0, 3),
      status: 'activated',
      vehicleNo: extraCol ? s(row[extraCol]) : undefined,
      bloodGroup: s(row.blood_group),
      medicalNotes: s(row.medical_notes),
    },
  };
}

/** SERVER-SIDE: contact details for masked calls / SMS. Only active, non-disabled tags. */
export async function getTagByQrIdAsync(rawQrId: string): Promise<QrTagRecord | undefined> {
  const qrId = normalizeTagId(rawQrId);
  if (!qrId) return undefined;
  const row = await getActiveOwnerRow(qrId);
  if (!row) return undefined;
  const { phoneCol, extraCol } = ownerTableFor(qrId);
  return {
    id: String(row.id),
    qrId,
    tagType: qrId.slice(0, 3) as TagType,
    status: 'activated',
    ownerName: s(row.owner_name),
    ownerPhone: s(row[phoneCol]),
    emergencyName: s(row.emergency_contact_name),
    emergencyPhone: s(row.emergency_contact_phone),
    vehicleNo: extraCol ? s(row[extraCol]) : undefined,
    bloodGroup: s(row.blood_group),
    medicalNotes: s(row.medical_notes),
    activatedAt: s(row.activated_at),
    createdAt: s(row.created_at),
  };
}

/* ---------- Demo-only in-memory provisioning (used by the unused AdminQRGenerator widget) ---------- */

const demoTags = new Map<string, QrTagRecord>();

export function getAllTags(): QrTagRecord[] {
  return Array.from(demoTags.values());
}

export function provisionNewTags(tagType: TagType, count: number): QrTagRecord[] {
  const newTags: QrTagRecord[] = [];
  const nextNumber = getAllTags().filter((t) => t.tagType === tagType).length + 1;
  for (let i = 0; i < count; i++) {
    const numStr = String(nextNumber + i).padStart(4, '0');
    const qrId = `${tagType}${numStr}`;
    const now = new Date().toISOString();
    const newTag: QrTagRecord = { id: `uuid-${tagType.toLowerCase()}-${numStr}`, qrId, tagType, status: 'printed', createdAt: now, updatedAt: now };
    demoTags.set(qrId, newTag);
    newTags.push(newTag);
  }
  return newTags;
}
