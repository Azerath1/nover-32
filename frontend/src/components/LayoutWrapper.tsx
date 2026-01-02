"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Разбиваем путь на части. Например:
  // /novel/slug -> segments: ["novel", "slug"] (длина 2)
  // /novel/slug/1 -> segments: ["novel", "slug", "1"] (длина 3)
  const segments = pathname.split("/").filter(Boolean);

  // Скрываем, если мы на странице чтения (ровно 3 сегмента и начинается с novel)
  const isReaderPage = segments.length === 3 && segments[0] === "novel";

  return (
    <>
      {!isReaderPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isReaderPage && <Footer />}
    </>
  );
}
