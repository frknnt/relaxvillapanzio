import type { Metadata } from "next";
import { LanguageProvider } from "@/components/site/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://harmonybalatonvilla.com"),
  title: "Harmony Balaton Villa | Rooms & Whole-Villa Stays",
  description:
    "Book a private room or reserve the whole four-bedroom Harmony Balaton Villa in Badacsonytomaj, with access to the pool, outdoor hot tub, barrel sauna and garden.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-exact.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/?lang=en",
      de: "/?lang=de",
      hu: "/?lang=hu",
      tr: "/?lang=tr",
      "x-default": "/?lang=en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Harmony Balaton Villa",
    title: "Harmony Balaton Villa | Rooms & Whole-Villa Stays",
    description: "Book a private room or all four rooms at Harmony Balaton Villa in Badacsonytomaj.",
    images: [{ url: "/brand/social-profile.png", width: 1024, height: 1024, alt: "Harmony Balaton Villa" }],
  },
  twitter: { card: "summary", title: "Harmony Balaton Villa", description: "Rooms and whole-villa stays in Badacsonytomaj.", images: ["/brand/social-profile.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
