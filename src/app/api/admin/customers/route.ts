import { ok, requireAdmin } from "@/lib/http";
import { listCustomers } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listCustomers());
}
