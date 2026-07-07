# CrossBorder Commerce

A portable cross-border ecommerce starter. It is intentionally product-agnostic: you can test categories and SKUs before deciding what to sell.

## Stack

- Next.js App Router + TypeScript
- REST-style API routes
- In-memory repository for fast iteration
- Vercel deployment
- Docker and Docker Compose for migration to any cloud server

For the full frontend, backend, and environment explanation, see `docs/stack.md`.

## Local Pages

Storefront:

- `/` - storefront and product catalog preview
- `/cart` - cart
- `/checkout` - checkout

Admin:

- `/admin` - dashboard and metrics
- `/admin/content` - homepage content and page templates
- `/admin/products` - products
- `/admin/products/new` - add product
- `/admin/media` - media
- `/admin/categories` - categories
- `/admin/attributes` - attributes
- `/admin/variants` - variants
- `/admin/orders` - orders
- `/admin/customers` - customers
- `/admin/inventory` - inventory
- `/admin/coupons` - coupons
- `/admin/payments` - payments
- `/admin/refunds` - refunds
- `/admin/reviews` - reviews
- `/admin/reports` - reports
- `/admin/tax` - tax
- `/admin/shipping` - shipping
- `/admin/fulfillment` - fulfillment
- `/admin/settings` - settings

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Create `.env` from `.env.example`:

```bash
ADMIN_TOKEN=your-secret-token
NEXT_PUBLIC_STORE_NAME=CrossBorder Commerce
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

When `ADMIN_TOKEN` is configured, `/admin/*` is protected by an HttpOnly admin session cookie. Open `/admin/login`, enter the token, and use the sign-out control in the admin header when finished.

Run the full local checks before shipping a change:

```bash
npm run lint
npm run typecheck
npm run build
npm run smoke
```

To smoke-test protected admin routes, start the dev server with `ADMIN_TOKEN` and pass the same value to the smoke runner:

```bash
ADMIN_TOKEN=your-secret-token npm run dev -- -p 3100
SMOKE_ADMIN_TOKEN=your-secret-token npm run smoke
```

## Storefront APIs

- `GET /api/products` - active product catalog
- `GET /api/products/:id` - product detail
- `GET /api/categories` - category list
- `POST /api/cart` - cart totals with stock, discount, shipping, and tax
- `POST /api/checkout` - checkout quote
- `POST /api/orders` - create order and reserve inventory
- `POST /api/coupons/validate` - validate coupon by subtotal
- `GET /api/shipping/rates?country=US` - available shipping rates

## Rendering and SEO

Public storefront pages are designed for SEO and cacheability:

- `/` uses ISR and can be served as cached HTML.
- `/products/:id` is statically generated from the product catalog and revalidates after product or content changes.
- `/cart` and `/checkout` are noindex because they are transactional pages.
- `/admin/*` is dynamic, cookie-protected, and noindex.
- `/robots.txt` blocks `/admin/` and `/api/`, while `/sitemap.xml` lists public storefront and product URLs.

Admin edits call `revalidatePath()` for affected public pages so cached storefront HTML can refresh without making public pages depend on login cookies.

## Admin APIs

Admin APIs accept the signed HttpOnly session cookie created by `/admin/login`. Automation and external tools can also use `x-admin-token: <ADMIN_TOKEN>`.

- `GET /api/admin/metrics`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/content`
- `PUT /api/admin/content`
- `GET /api/admin/products/:id`
- `PUT /api/admin/products/:id`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `GET /api/admin/attributes`
- `POST /api/admin/attributes`
- `GET /api/admin/variants`
- `POST /api/admin/variants`
- `GET /api/admin/media`
- `POST /api/admin/media`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders`
- `GET /api/admin/customers`
- `GET /api/admin/inventory`
- `PATCH /api/admin/inventory`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PATCH /api/admin/coupons`
- `GET /api/admin/payments`
- `PATCH /api/admin/payments`
- `GET /api/admin/refunds`
- `PATCH /api/admin/refunds`
- `GET /api/admin/reviews`
- `PATCH /api/admin/reviews`
- `POST /api/admin/fulfillment`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

## Migration to Other Clouds

This project can leave Vercel at any time. Build and run it on any Docker-capable server:

```bash
docker compose up --build -d
```

For production, replace the in-memory repository in `src/lib/store.ts` with PostgreSQL, MySQL, MongoDB, or another managed database. The API contracts are already separated from the storage implementation.

## Next Backend Milestones

- Persistent database and migrations
- Authenticated admin users and roles
- Product variants and media upload
- Stripe/PayPal payment adapters
- Real carrier integrations
- Return/refund workflow
- Webhook processing
- Audit logs and analytics events
