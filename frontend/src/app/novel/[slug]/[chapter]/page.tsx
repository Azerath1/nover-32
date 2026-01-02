"use client";

import React, { useState, useEffect, use } from "react";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Settings, List } from "lucide-react"; // Удалил лишние иконки
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider"; // Удалил Separator
import { findNovelBySlug } from "@/lib/novels-data";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const THEMES = [
  { name: "light", bg: "bg-white", text: "text-gray-900", label: "Светлая" },
  { name: "sepia", bg: "bg-[#f4ecd8]", text: "text-[#5b4636]", label: "Сепия" },
  { name: "dark", bg: "bg-[#1a1a1a]", text: "text-[#d1d5db]", label: "Тёмная" },
  { name: "black", bg: "bg-black", text: "text-gray-300", label: "Ночь" },
];

export default function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = use(params);
  const router = useRouter();
  const currentChapterNum = parseInt(chapter);

  // Оставляем базовые значения
  const [fontSize, setFontSize] = useState(18);
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 1. Используем один useEffect для начальной синхронизации
  useEffect(() => {
    const savedSize = localStorage.getItem("novera-font-size");
    const savedTheme = localStorage.getItem("novera-theme");

    // Оборачиваем в проверку, чтобы не менять состояние, если данных нет
    if (savedSize || savedTheme) {
      if (savedSize) setFontSize(Number(savedSize));
      if (savedTheme) {
        const theme = THEMES.find((t) => t.name === savedTheme);
        if (theme) setCurrentTheme(theme);
      }
    }

    setIsLoaded(true);
  }, []); // Пустой массив — выполняется 1 раз при монтировании

  // 2. Сохранение настроек (только после того как мы загрузили старые)
  useEffect(() => {
    if (!isLoaded) return; // Пропускаем первый цикл, пока не загрузились старые данные

    localStorage.setItem("novera-font-size", fontSize.toString());
    localStorage.setItem("novera-theme", currentTheme.name);
  }, [fontSize, currentTheme, isLoaded]);

  // 3. Прогресс скролла
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. Скролл вверх при смене главы (ТЕПЕРЬ ДО RETURN)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapter]);

  // ТОЛЬКО ПОСЛЕ ВСЕХ ХУКОВ ИДУТ ПРОВЕРКИ И ПОИСК ДАННЫХ
  const novel = findNovelBySlug(slug);

  if (!novel || isNaN(currentChapterNum)) return notFound();

  const hasNext = currentChapterNum < novel.chapters;
  const hasPrev = currentChapterNum > 1;

  const goToChapter = (num: number) => router.push(`/novel/${slug}/${num}`);

  const chapterData = novel.chapterList[currentChapterNum - 1];
  const chapterContent =
    chapterData?.content || "Текст этой главы еще не загружен на сервер.";

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isLoaded ? currentTheme.bg : "bg-[#1a1a1a]"
      )}
    >
      <header
        className={cn(
          "sticky top-0 z-50 flex h-14 items-center justify-between border-b px-4 transition-colors duration-300 shadow-sm",
          currentTheme.name === "light" || currentTheme.name === "sepia"
            ? "border-gray-200 bg-white/90 backdrop-blur"
            : "border-gray-800 bg-black/80 backdrop-blur"
        )}
      >
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="flex items-center gap-2">
          <Link href={`/novel/${slug}`}>
            <Button variant="ghost" size="icon" className={currentTheme.text}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="hidden md:flex flex-col">
            <span className={cn("text-sm font-bold", currentTheme.text)}>
              {novel.title}
            </span>
            <span className={cn("text-xs opacity-70", currentTheme.text)}>
              Глава {currentChapterNum}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={currentTheme.text}>
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-75 sm:w-100">
              <SheetHeader>
                <SheetTitle>Оглавление</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)] mt-4">
                {Array.from({ length: novel.chapters }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <Button
                      key={num}
                      variant={
                        num === currentChapterNum ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => goToChapter(num)}
                    >
                      Глава {num}
                    </Button>
                  );
                })}
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className={currentTheme.text}>
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4">
              <div className="space-y-4">
                <p className="text-sm font-medium">Настройки текста</p>
                <div className="flex gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setCurrentTheme(t)}
                      className={cn(
                        "h-8 w-8 rounded-full border",
                        t.bg,
                        currentTheme.name === t.name && "ring-2 ring-blue-500"
                      )}
                    />
                  ))}
                </div>
                <Slider
                  value={[fontSize]}
                  min={12}
                  max={32}
                  onValueChange={(v) => setFontSize(v[0])}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <main className="container mx-auto max-w-200 px-4 py-10">
        {!isLoaded ? (
          // СОСТОЯНИЕ ЗАГРУЗКИ (SKELETON)
          <div className="space-y-6">
            {/* Скелетон заголовка */}
            <Skeleton className="h-10 w-3/4 mx-auto mb-10" />

            {/* Скелетон текста (строки) */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[40%]" />
            </div>

            {/* Скелетон кнопок навигации */}
            <div className="mt-16 flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        ) : (
          // РЕАЛЬНЫЙ КОНТЕНТ (отображается только когда isLoaded === true)
          <>
            <h1
              className={cn(
                "text-3xl font-bold text-center mb-10",
                currentTheme.text
              )}
            >
              {chapterData?.title || `Глава ${currentChapterNum}`}
            </h1>
            <article
              className={cn("prose-lg whitespace-pre-line", currentTheme.text)}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
            >
              {chapterContent}
            </article>

            <div className="mt-16 flex gap-4">
              <Button
                className="flex-1"
                variant="outline"
                disabled={!hasPrev}
                onClick={() => goToChapter(currentChapterNum - 1)}
              >
                Назад
              </Button>
              <Button
                className="flex-1 bg-blue-600 text-white"
                disabled={!hasNext}
                onClick={() => goToChapter(currentChapterNum + 1)}
              >
                Вперед
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
