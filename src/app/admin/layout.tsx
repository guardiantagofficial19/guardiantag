import "./admin.css";
export const metadata = { title: "GuardianTag Admin", robots: { index: false, follow: false } };
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="adm-root">{children}</div>;
}
