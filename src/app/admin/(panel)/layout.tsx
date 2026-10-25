import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="adm">
      <aside>
        <div className="brand">GT <span>Admin</span></div>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/inventory">Inventory</Link>
          <Link href="/admin/tags">QR Tags</Link>
          <Link href="/admin/qr-generator">QR Print Sheets</Link>
        </nav>
        <form action={logoutAction}><button className="ghost">Log out</button></form>
      </aside>
      <main>{children}</main>
    </div>
  );
}
