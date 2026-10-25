# GuardianTag Store Manager: setup

## 1. Copy the files
Unzip and copy everything into your project root, keeping the folders. Say yes to replacing files.

Then **delete** these old files (they were the insecure OTP login):

```
src/middleware.ts
src/app/admin/page.tsx
src/components/AdminGatekeeper.tsx
src/lib/security/adminAuth.ts
src/app/api/admin/auth/request-otp/route.ts
src/app/api/admin/auth/verify-otp/route.ts
```

`src/middleware.ts` must be deleted. Next.js 16 uses `src/proxy.ts` instead, and having both breaks the build.

## 2. Create the tables in Neon
Neon console → SQL Editor → paste all of `db/admin-schema.sql` → Run.
It only adds new `store_*` tables. It does not touch your tag tables, and it is safe to run again.

## 3. Add environment variables in Vercel
Vercel → your project → Settings → Environment Variables:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | A long password only you know |
| `ADMIN_SESSION_SECRET` | A random string, 64 characters. Generate one at https://generate-secret.vercel.app/64 |
| `DATABASE_URL` | Your Neon connection string (probably already set) |

`ADMIN_AUTH_SECRET` from `.env.example` is no longer used.

## 4. Push and deploy
Commit, push, wait for Vercel to deploy. Open `/admin` and sign in with `ADMIN_PASSWORD`.

## 5. First things to do
1. **Inventory** → Adjust stock on the biker kit (e.g. +50). Stock starts at 0, so orders fail until you add some.
2. **Orders** → New order, to log a WhatsApp order. Mark it paid once the UPI payment comes in.
3. **QR Tags** → Generate a batch and download the CSV for your printer.

## What each page does
- **Dashboard**: new orders, orders to ship, paid revenue (30 days), unpaid amount, low stock, tag counts, recent scans.
- **Orders**: filter by status, search by name, phone, order number or tracking. Each order has status (new → packed → shipped → delivered, or cancelled), payment (unpaid / paid / refunded), courier, tracking number and notes. Cancelling returns the stock automatically.
- **Inventory**: edit name, price, low-stock alert level, show or hide a product, add or remove stock with a reason. Every stock change is logged.
- **QR Tags**: generate numbered batches (GTB0002, GTB0003 …), search, export CSV with each tag's scan link (`/tag/GTB0002`). **Disable** stops a tag working on scan and blocks calls to its owner. **Reset** wipes the owner so the tag can be activated again (bike sold, lost PIN).
- **QR Print Sheets**: your existing print-layout generator, now behind the same login.
