import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdsPolisher | Creative Ad Studio",
  description: "A scrollable showcase of AdsPolisher creative campaigns.",
  icons: {
    icon: "/logo/adspolisher_color.png",
    shortcut: "/logo/adspolisher_color.png",
    apple: "/logo/adspolisher_color.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
