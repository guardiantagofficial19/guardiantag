import { sql } from "@/lib/db";
import { dt, TAG_TYPES } from "@/lib/format";
import { generateTagsAction, tagStatusAction } from "../../actions";
import ConfirmButton from "@/components/ConfirmButton";
import Link from "next/link";

type SP = { type?: string; status?: string; q?: string; made?: string; error?: string };

export default async function Tags({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const type = sp.type && (TAG_TYPES as readonly string[]).includes(sp.type) ? sp.type : null;
  const status = sp.status || null;
  const pat = sp.q ? `%${sp.q}%` : null;
  const [counts, tags] = await Promise.all([
    sql`SELECT tag_type, status, count(*)::int AS n FROM qr_tags GROUP BY 1, 2 ORDER BY 1, 2`,
    sql`SELECT qr_id, tag_type, status, owner_name, vehicle_no, activated_at, created_at FROM qr_tags
        WHERE (${type}::text IS NULL OR tag_type = ${type}::text)
          AND (${status}::text IS NULL OR status = ${status}::text)
          AND (${pat}::text IS NULL OR qr_id ILIKE ${pat}::text OR owner_name ILIKE ${pat}::text OR vehicle_no ILIKE ${pat}::text)
        ORDER BY created_at DESC, qr_id DESC LIMIT 200`,
  ]);
  const exportQs = new URLSearchParams({ ...(type && { type }), ...(status && { status }) }).toString();
  return (
    <>
      <h1>QR Tags</h1>
      {sp.made && <p className="ok">{sp.made}</p>}
      {sp.error && <p className="err">{sp.error}</p>}
      <div className="grid2">
        <section className="card">
          <h2>Generate a batch</h2>
          <form action={generateTagsAction} className="form cols">
            <select name="type">{TAG_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            <input name="qty" type="number" min={1} max={500} defaultValue={50} />
            <button>Generate</button>
          </form>
          <p className="muted">IDs continue from the highest existing number (e.g. GTB0002, GTB0003…). New tags start as <b>printed</b>. Download the CSV and send it to your printer.</p>
        </section>
        <section className="card">
          <h2>Overview</h2>
          <table><tbody>{counts.map((c) => (<tr key={c.tag_type + c.status}><td>{c.tag_type}</td><td>{c.status}</td><td>{c.n}</td></tr>))}</tbody></table>
        </section>
      </div>
      <div className="tabs">
        <Link href="/admin/tags" className={!type && !status ? "on" : ""}>All</Link>
        {TAG_TYPES.map((t) => (<Link key={t} href={`/admin/tags?type=${t}`} className={type === t ? "on" : ""}>{t}</Link>))}
        <Link href="/admin/tags?status=printed" className={status === "printed" ? "on" : ""}>unactivated</Link>
        <Link href="/admin/tags?status=disabled" className={status === "disabled" ? "on" : ""}>disabled</Link>
        <a className="btn small" href={`/admin/tags/export${exportQs ? `?${exportQs}` : ""}`}>⬇ CSV</a>
        <form className="search"><input name="q" defaultValue={sp.q} placeholder="Search tag, owner, vehicle" /></form>
      </div>
      <div className="card scroll">
        <table>
          <thead><tr><th>Tag</th><th>Status</th><th>Owner</th><th>Vehicle</th><th>Activated</th><th></th></tr></thead>
          <tbody>
            {tags.map((t) => (
              <tr key={t.qr_id}>
                <td><b>{t.qr_id}</b></td>
                <td><span className={`pill ${t.status}`}>{t.status}</span></td>
                <td>{t.owner_name ?? "—"}</td><td>{t.vehicle_no ?? "—"}</td><td className="muted">{dt(t.activated_at)}</td>
                <td className="actions">
                  <form action={tagStatusAction}>
                    <input type="hidden" name="qr_id" value={t.qr_id} />
                    {t.status === "disabled"
                      ? <button name="act" value="enable" className="ghost">Enable</button>
                      : <ConfirmButton name="act" value="disable" message={`Disable ${t.qr_id}? Scanning it will stop working.`} className="ghost">Disable</ConfirmButton>}
                  </form>
                  <form action={tagStatusAction}>
                    <input type="hidden" name="qr_id" value={t.qr_id} />
                    <input type="hidden" name="act" value="reset" />
                    <ConfirmButton message={`Reset ${t.qr_id}? This erases the owner, contacts and PIN so the tag can be re-activated (use after a bike sale or lost PIN).`} className="ghost danger">Reset</ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
            {!tags.length && <tr><td colSpan={6} className="muted">No tags match.</td></tr>}
          </tbody>
        </table>
        <p className="muted">Showing up to 200. PIN hashes are never displayed.</p>
      </div>
    </>
  );
}
