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

## Admin APIs

All admin APIs require `x-admin-token: <ADMIN_TOKEN>`.

- `GET /api/admin/metrics`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/orders`
- `GET /api/admin/customers`
- `GET /api/admin/inventory`
- `POST /api/admin/fulfillment`
- `GET /api/admin/settings`

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
