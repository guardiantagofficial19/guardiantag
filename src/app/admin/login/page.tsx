import { loginAction } from "../actions";
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Store } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopifyLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="shopify-login-container">
      <div className="shopify-login-card">
        {/* Brand Header */}
        <div className="shopify-login-header">
          <div className="shopify-brand-badge">GT</div>
          <div className="shopify-login-title">GuardianTag</div>
          <div className="shopify-login-subtitle">Store Manager • Shopify Admin</div>
        </div>

        {error && (
          <div className="shopify-login-error">
            <AlertCircle size={16} />
            <span>Incorrect password. Please try again.</span>
          </div>
        )}

        {/* Login Form */}
        <form action={loginAction} className="shopify-login-form">
          <div className="polaris-form-group">
            <label className="polaris-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Admin Password</span>
              <span style={{ fontSize: 11, color: "var(--shopify-text-subdued)", fontWeight: 400 }}>Protected Portal</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                name="password"
                placeholder="Enter admin password"
                autoFocus
                required
                className="polaris-input"
                style={{ paddingLeft: 34, height: 42, fontSize: 14 }}
              />
              <Lock
                size={15}
                style={{
                  position: "absolute",
                  left: 11,
                  top: 13,
                  color: "var(--shopify-text-subdued)",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-polaris-primary"
            style={{ width: "100%", justifyContent: "center", height: 42, fontSize: 14, marginTop: 4 }}
          >
            <span>Sign In to Store Manager</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Security Footer */}
        <div className="shopify-login-footer">
          <ShieldCheck size={14} color="#16a34a" />
          <span>Encrypted Session • HMAC-SHA256 Protected</span>
        </div>
      </div>
    </div>
  );
}
