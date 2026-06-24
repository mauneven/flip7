import type { Metadata, Viewport } from "next";
import { LangProvider } from "@/lib/lang";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLIP 7 — Scoreboard",
  description:
    "A clean, multilingual scoreboard for the FLIP 7 card game. Track rounds, count cards automatically and crown a winner.",
  applicationName: "FLIP 7 Scoreboard",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FLIP 7",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
