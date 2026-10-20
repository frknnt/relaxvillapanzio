import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Harmony Balaton Villa",
  description: "Harmony Balaton Villa rezervasyon ve içerik yönetimi",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
