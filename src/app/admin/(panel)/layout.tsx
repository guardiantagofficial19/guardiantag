import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import { logoutAction } from "../actions";
import { sql } from "@/lib/db";
import {
  Home,
  Package,
  Tag,
  Users,
  Layers,
  QrCode,
  Building2,
  Printer,
  Settings,
  ExternalLink,
  Search,
  Bell,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifyPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  // Fetch open orders counter for Shopify-style badge
  let openOrdersCount = 0;
  try {
    const res = await sql`SELECT count(*)::int as count FROM store_orders WHERE status IN ('new', 'packed')`;
    openOrdersCount = res[0]?.count || 0;
  } catch {
    // Non-blocking
  }

  return (
    <div className="adm-shell">
      {/* Shopify Dark Slate Sidebar */}
      <aside className="shopify-sidebar">
        {/* Store Brand / Switcher */}
        <div className="sidebar-store-header">
          <div className="store-brand">
            <div className="store-brand-icon">GT</div>
            <div>
              <div className="store-name">GuardianTag</div>
              <div className="store-tagline">
                <span className="store-live-dot" /> Store Manager
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-group-title">Store Management</div>

          <Link href="/admin" className="nav-item">
            <div className="nav-item-left">
              <Home size={17} />
              <span>Home</span>
            </div>
          </Link>

          <Link href="/admin/orders" className="nav-item">
            <div className="nav-item-left">
              <Package size={17} />
              <span>Orders</span>
            </div>
            {openOrdersCount > 0 && (
              <span className="nav-counter-pill">{openOrdersCount}</span>
            )}
          </Link>

          <Link href="/admin/products" className="nav-item">
            <div className="nav-item-left">
              <Tag size={17} />
              <span>Products</span>
            </div>
          </Link>

          <Link href="/admin/customers" className="nav-item">
            <div className="nav-item-left">
              <Users size={17} />
              <span>Customers</span>
            </div>
          </Link>

          <Link href="/admin/inventory" className="nav-item">
            <div className="nav-item-left">
              <Layers size={17} />
              <span>Inventory</span>
            </div>
          </Link>

          <div className="nav-group-title">Hardware & Fleets</div>

          <Link href="/admin/tags" className="nav-item">
            <div className="nav-item-left">
              <QrCode size={17} />
              <span>QR Tag Registry</span>
            </div>
          </Link>

          <Link href="/admin/fleets" className="nav-item">
            <div className="nav-item-left">
              <Building2 size={17} />
              <span>Fleet Accounts</span>
            </div>
          </Link>

          <Link href="/admin/qr-generator" className="nav-item">
            <div className="nav-item-left">
              <Printer size={17} />
              <span>Print Sheets</span>
            </div>
          </Link>

          <div className="nav-group-title">Preferences</div>

          <Link href="/admin/settings" className="nav-item">
            <div className="nav-item-left">
              <Settings size={17} />
              <span>Settings</span>
            </div>
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="admin-avatar-wrap">
            <div className="admin-avatar">AD</div>
            <div className="admin-info">
              <span className="admin-name">Store Admin</span>
              <span className="admin-role">GuardianTag Verified</span>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              title="Log Out"
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </aside>

      {/* Main App Content Area */}
      <div className="shopify-main-wrapper">
        {/* Shopify Top App Bar */}
        <header className="shopify-top-bar">
          <div className="top-search-wrap">
            <Search size={15} className="top-search-icon" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="top-search-input"
            />
          </div>

          <div className="top-bar-actions">
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#15803d",
                backgroundColor: "#dcfce7",
                padding: "3px 9px",
                borderRadius: 99,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span className="store-live-dot" /> Online Store
            </span>

            <a
              href="/products"
              target="_blank"
              rel="noopener noreferrer"
              className="view-store-btn"
            >
              <span>View Online Store</span>
              <ExternalLink size={13} />
            </a>

            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "1px solid #e1e3e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6d7175",
                cursor: "pointer",
              }}
              title="Notifications"
            >
              <Bell size={16} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="shopify-content">{children}</main>
      </div>
    </div>
  );
}
