export const ADMIN_COOKIE = "crossborder_admin_session";

const encoder = new TextEncoder();

export async function createAdminSessionValue(adminToken: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`crossborder-admin-session:${adminToken}`)
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
