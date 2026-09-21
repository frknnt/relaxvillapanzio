import type { Metadata } from "next";
import { LanguageProvider } from "@/components/site/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relax Villa Badacsonytomaj | Private 4-Bedroom Villa",
  description:
    "A private four-bedroom villa in Badacsonytomaj for one group, with pool, outdoor hot tub, barrel sauna, garden and direct booking.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
