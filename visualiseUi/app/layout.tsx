import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "visualise — a small archive for big ideas",
  description: "An isometric visual library for creative work in progress.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
