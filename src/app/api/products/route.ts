import { ok } from "@/lib/http";
import { listProducts } from "@/lib/store";

export async function GET() {
  return ok(listProducts());
}
