import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdSpolisher | Creative Ad Studio",
  description: "A scrollable showcase of AdSpolisher creative campaigns.",
  icons: {
    icon: "/logo/adspolisher.png",
    shortcut: "/logo/adspolisher.png",
    apple: "/logo/adspolisher.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
