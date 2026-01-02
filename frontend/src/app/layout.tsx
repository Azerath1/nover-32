import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Novera",
  description: "Платформа для чтения",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        {/* Обертываем всё в ThemeProvider для поддержки тем */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Темная тема по умолчанию
          enableSystem={true} // Включает поддержку системных настроек
          disableTransitionOnChange
        >
          {/* Твой существующий LayoutWrapper */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
