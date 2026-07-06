# Stack and Environment

## What This Project Uses

This is a full-stack TypeScript ecommerce project.

- Frontend: React 19 with Next.js App Router
- Backend: Next.js Route Handlers, written in TypeScript
- API style: REST-style JSON endpoints
- Data layer today: in-memory TypeScript repository in `src/lib/store.ts`
- Request validation: Zod
- Local runtime: Node.js 22+ or Node.js 24
- Package manager: npm
- Deployment target: Vercel
- Portable server target: Docker and Docker Compose

## Frontend

The frontend is built with React and Next.js.

Main storefront pages:

- `/` - storefront homepage and product catalog preview
- `/cart` - cart page
- `/checkout` - checkout page

Admin pages:

- `/admin` - dashboard and metrics
- `/admin/products` - products
- `/admin/categories` - categories
- `/admin/orders` - orders
- `/admin/customers` - customers
- `/admin/inventory` - inventory
- `/admin/coupons` - coupons
- `/admin/tax` - tax
- `/admin/shipping` - shipping
- `/admin/fulfillment` - fulfillment
- `/admin/settings` - store settings

UI files:

- `src/app/page.tsx`
- `src/app/cart/page.tsx`
- `src/app/checkout/page.tsx`
- `src/app/admin/**/page.tsx`
- `src/components/AdminLayout.tsx`
- `src/app/styles.css`

## Backend

The backend is not a separate Express server. It is built into Next.js through server route handlers.

Storefront API routes:

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/cart`
- `POST /api/checkout`
- `POST /api/orders`
- `POST /api/coupons/validate`
- `GET /api/shipping/rates?country=US`

Admin API routes:

- `GET /api/admin/metrics`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/orders`
- `GET /api/admin/customers`
- `GET /api/admin/inventory`
- `POST /api/admin/fulfillment`
- `GET /api/admin/settings`

Backend source files:

- `src/lib/store.ts` - business logic and temporary data repository
- `src/lib/types.ts` - product, order, customer, cart, coupon, shipping, and settings types
- `src/lib/schemas.ts` - Zod validation schemas
- `src/lib/http.ts` - API response helpers and admin token guard

## WooCommerce-Style Feature Coverage

The project now has local pages for the necessary ecommerce management areas:

- Products and product catalog
- Categories
- Cart
- Checkout
- Orders
- Customers
- Inventory and stock reservations
- Coupons
- Tax settings
- Shipping zones and rates
- Fulfillment and tracking
- Store settings
- Dashboard metrics

This copies the necessary ecommerce capability model, not WooCommerce branding or WordPress internals.

## Current Storage

Data is currently stored in memory in `src/lib/store.ts`. This is good for early product development because you can change the business model quickly.

The production version should replace this with:

- PostgreSQL for orders, products, customers, inventory, coupons, and payments
- Prisma or Drizzle for migrations and typed queries
- Redis later for carts, sessions, locks, and rate limits

## Local Commands

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Type-check:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

Run production build:

```bash
npm run start
```

Docker:

```bash
docker compose up --build -d
```

## Environment Variables

Use `.env.example` as the starting point.

- `ADMIN_TOKEN` - required by admin APIs using the `x-admin-token` header
- `NEXT_PUBLIC_STORE_NAME` - public storefront name
