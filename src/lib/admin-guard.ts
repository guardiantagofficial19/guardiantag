import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifyToken } from "./admin-auth";

export async function requireAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!(await verifyToken(token))) redirect("/admin/login");
}
