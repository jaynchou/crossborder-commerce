import { ok } from "@/lib/http";
import { listCategories } from "@/lib/store";

export async function GET() {
  return ok(listCategories());
}
