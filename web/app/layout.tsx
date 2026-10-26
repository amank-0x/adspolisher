import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdSpolisher | Creative Ad Studio",
  description: "A scrollable showcase of AdSpolisher creative campaigns.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
