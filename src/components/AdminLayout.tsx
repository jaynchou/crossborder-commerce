import Link from "next/link";
import type { ReactNode } from "react";
import { AdminSignOutButton } from "@/components/AdminSignOutButton";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/new", label: "Add Product" },
  { href: "/admin/merchandising", label: "Merchandising" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/attributes", label: "Attributes" },
  { href: "/admin/variants", label: "Variants" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/refunds", label: "Refunds" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/tax", label: "Tax" },
  { href: "/admin/shipping", label: "Shipping" },
  { href: "/admin/fulfillment", label: "Fulfillment" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/", label: "Storefront" }
];

type AdminLayoutProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export function AdminLayout({ eyebrow = "Commerce admin", title, children }: AdminLayoutProps) {
  return (
    <main className="adminShell">
      <aside className="sidebar">
        <strong>CrossBorder Admin</strong>
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>{item.label}</Link>
        ))}
        <AdminSignOutButton />
      </aside>
      <section className="adminMain">
        <div className="adminHeader">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        {children}
      </section>
    </main>
  );
}
