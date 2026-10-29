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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
