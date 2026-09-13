import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relax Villa | Private Villa in Badacsonytomaj",
  description:
    "Reserve the complete four-bedroom Relax Villa in Badacsonytomaj for your group.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
