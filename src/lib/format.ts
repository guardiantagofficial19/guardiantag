export const inr = (paise: number | string) =>
  "₹" + (Number(paise) / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
export const dt = (d: string | Date | null | undefined) =>
  d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "—";
export const ORDER_STATUSES = ["new", "packed", "shipped", "delivered", "cancelled"] as const;
export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;
export const TAG_TYPES = ["GTB", "GTK", "GTT", "GTU"] as const;
