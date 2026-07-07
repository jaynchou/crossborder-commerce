import type { Metadata } from "next";
import "./styles.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CrossBorder Commerce",
    template: "%s | CrossBorder Commerce"
  },
  description: "A portable cross-border commerce storefront for curated global products.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "CrossBorder Commerce",
    description: "Shop curated cross-border lifestyle products with transparent shipping, tax, and promotions.",
    url: "/",
    siteName: "CrossBorder Commerce",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
