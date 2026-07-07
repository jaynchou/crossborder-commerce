const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3100";
let adminCookie = "";

const routes = [
  { path: "/", mustContain: ["CrossBorder Commerce", "Starter catalog"] },
  { path: "/robots.txt", mustContain: ["Disallow: /admin/", "Sitemap:"] },
  { path: "/sitemap.xml", mustContain: ["/apparel", "/products/album-cloud-001", "<urlset"] },
  { path: "/apparel", mustContain: ["Apparel", "Merino Travel Scarf", "Collection"] },
  { path: "/cart", mustContain: ["Your cart", "Order summary", "noindex"] },
  { path: "/checkout", mustContain: ["Checkout", "Order total", "noindex"] },
  { path: "/products/album-cloud-001", mustContain: ["Merino Travel Scarf", "Related products", "Reviews", "application/ld+json", "\"@type\":\"Product\""] },
  { path: "/admin/login", mustContain: ["Admin sign in", "Admin token"] },
  { path: "/admin", mustContain: ["Dashboard", "Recent order activity", "noindex"], admin: true },
  { path: "/admin/content", mustContain: ["Content editor", "Homepage editor", "Page templates", "noindex"], admin: true },
  { path: "/admin/products", mustContain: ["Product management", "Edit", "noindex"], admin: true },
  { path: "/admin/products/new", mustContain: ["Create product", "Product information", "noindex"], admin: true },
  { path: "/admin/products/album-cloud-001", mustContain: ["Edit product", "Media URLs", "noindex"], admin: true },
  { path: "/admin/categories", mustContain: ["Category pages", "Create category page", "Open page", "noindex"], admin: true },
  { path: "/admin/attributes", mustContain: ["Product attributes", "Add attribute", "noindex"], admin: true },
  { path: "/admin/variants", mustContain: ["Product variants", "Create variant", "noindex"], admin: true },
  { path: "/admin/media", mustContain: ["Media library", "Register media", "noindex"], admin: true },
  { path: "/admin/merchandising", mustContain: ["Cross-sell rules", "Promotion placements", "noindex"], admin: true },
  { path: "/admin/orders", mustContain: ["Order management", "Mark paid", "noindex"], admin: true },
  { path: "/admin/customers", mustContain: ["Customer records", "noindex"], admin: true },
  { path: "/admin/inventory", mustContain: ["Stock and reservations", "Save", "noindex"], admin: true },
  { path: "/admin/coupons", mustContain: ["Promotion codes", "Create promotion", "noindex"], admin: true },
  { path: "/admin/payments", mustContain: ["Payment methods", "Enable", "noindex"], admin: true },
  { path: "/admin/refunds", mustContain: ["Refund requests", "Approve", "noindex"], admin: true },
  { path: "/admin/reviews", mustContain: ["Review moderation", "Approve", "noindex"], admin: true },
  { path: "/admin/reports", mustContain: ["Reports", "noindex"], admin: true },
  { path: "/admin/tax", mustContain: ["Tax settings", "Editable settings", "noindex"], admin: true },
  { path: "/admin/shipping", mustContain: ["Shipping zones and rates", "Add rate", "noindex"], admin: true },
  { path: "/admin/fulfillment", mustContain: ["Pick, pack, and tracking", "Save tracking", "noindex"], admin: true },
  { path: "/admin/settings", mustContain: ["Store settings", "Editable settings", "noindex"], admin: true }
];

const suspiciousText = [0xfffd, 0x923d, 0x8133, 0x8def].map((codePoint) =>
  String.fromCodePoint(codePoint)
);
const failures = [];

if (process.env.SMOKE_ADMIN_TOKEN) {
  const unauthenticatedAdmin = await fetch(`${baseUrl}/admin`, { redirect: "manual" });
  const location = unauthenticatedAdmin.headers.get("location") ?? "";
  if (![307, 308].includes(unauthenticatedAdmin.status)) {
    failures.push(
      `/admin: expected unauthenticated redirect, got ${unauthenticatedAdmin.status}`
    );
  }
  if (!location.includes("/admin/login")) {
    failures.push(`/admin: expected redirect to /admin/login, got "${location}"`);
  }

  const response = await fetch(`${baseUrl}/api/admin/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: process.env.SMOKE_ADMIN_TOKEN })
  });
  if (response.ok) {
    adminCookie = response.headers.get("set-cookie")?.split(";")[0] ?? "";
    const adminApiResponse = await fetch(`${baseUrl}/api/admin/categories`, {
      headers: { cookie: adminCookie }
    });
    if (!adminApiResponse.ok) {
      failures.push(`admin API cookie check failed with ${adminApiResponse.status}`);
    }
  } else {
    failures.push(`admin login failed with ${response.status}`);
  }
}

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route.path}`, {
    headers: route.admin && adminCookie ? { cookie: adminCookie } : {}
  });
  const html = await response.text();

  if (!response.ok) {
    failures.push(`${route.path}: expected 2xx, got ${response.status}`);
    continue;
  }

  for (const expected of route.mustContain) {
    if (!html.includes(expected)) {
      failures.push(`${route.path}: missing text "${expected}"`);
    }
  }

  if (route.admin && route.path !== "/admin/login") {
    for (const tokenText of ["ADMIN_TOKEN", "Admin token"]) {
      if (html.includes(tokenText)) {
        failures.push(`${route.path}: should use the signed admin session, but still renders "${tokenText}"`);
      }
    }
  }

  for (const text of suspiciousText) {
    if (html.includes(text)) {
      failures.push(`${route.path}: contains suspicious text "${text}"`);
    }
  }
}

if (failures.length) {
  console.error("Smoke check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Smoke check passed for ${routes.length} routes.`);
