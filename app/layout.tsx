import type { Metadata } from "next";
import { LanguageProvider } from "@/components/site/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://villademo.caeldigital.com"),
  title: "Relax Villa Badacsonytomaj | Rooms & Whole-Villa Stays",
  description:
    "Book a private room or reserve the whole four-bedroom Relax Villa in Badacsonytomaj, with access to the pool, outdoor hot tub, barrel sauna and garden.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
    siteName: "Relax Villa Panzió",
    title: "Relax Villa Badacsonytomaj | Rooms & Whole-Villa Stays",
    description: "Book a private room or all four rooms at Relax Villa Panzió in Badacsonytomaj.",
  },
  twitter: { card: "summary", title: "Relax Villa Panzió", description: "Rooms and whole-villa stays in Badacsonytomaj." },
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
