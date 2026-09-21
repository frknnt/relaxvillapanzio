import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Relax Villa",
  description: "Relax Villa rezervasyon ve içerik yönetimi",
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
