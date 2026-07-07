import type { Metadata } from "next";
import "./styles.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CrossBorder Commerce",
  description: "A portable cross-border commerce platform starter"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
