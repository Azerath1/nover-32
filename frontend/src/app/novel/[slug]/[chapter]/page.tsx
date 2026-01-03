"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Sun,
  Moon,
  Monitor,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = "http://localhost:8000";

interface Chapter {
  id: number;
  title: string;
  content: string;
  chapter_number: number;
  created_at: string;
  novel_id: number;
}

interface Theme {
  name: string;
  bg: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const THEMES: Theme[] = [
  {
    name: "light",
    bg: "bg-white",
    text: "text-gray-900",
    icon: Sun,
    label: "Светлая",
  },
  {
    name: "sepia",
    bg: "bg-[#f4ecd8]",
    text: "text-[#5b4636]",
    icon: Monitor,
    label: "Сепия",
  },
  {
    name: "dark",
    bg: "bg-[#1a1a1a]",
    text: "text-[#d1d5db]",
    icon: Moon,
    label: "Тёмная",
  },
  {
    name: "black",
    bg: "bg-black",
    text: "text-gray-300",
    icon: Moon,
    label: "Ночь",
  },
];

const DEFAULT_THEME = THEMES[2];

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const novelId = params.slug as string;
  const chapterNum = parseInt(params.chapter as string);

  const [fontSize, setFontSize] = useState(18);
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedSize = localStorage.getItem("novera-font-size");
    const savedThemeName = localStorage.getItem("novera-theme");

    if (savedSize) setFontSize(Number(savedSize));
    if (savedThemeName) {
      const theme = THEMES.find((t) => t.name === savedThemeName);
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  useEffect(() => {
    async function fetchChapter() {
      try {
        const res = await fetch(`${API_URL}/novels/${novelId}/chapters/`);
        if (!res.ok) throw new Error("Не удалось загрузить главы");
        const chapters: Chapter[] = await res.json();

        const foundChapter = chapters.find(
          (ch) => ch.chapter_number === chapterNum
        );
        setChapter(foundChapter || null);
      } catch (err) {
        console.error(err);
        setChapter(null);
      } finally {
        setLoading(false);
      }
    }

    fetchChapter();
  }, [novelId, chapterNum]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("novera-font-size", fontSize.toString());
      localStorage.setItem("novera-theme", currentTheme.name);
    }
  }, [fontSize, currentTheme, mounted]);

  const appliedTheme = mounted ? currentTheme : DEFAULT_THEME;
  const hasPrev = chapterNum > 1;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${appliedTheme.bg} ${appliedTheme.text}`}
    >
      {/* Фиксированная шапка */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold truncate max-w-md">
              {chapter
                ? `Глава ${chapter.chapter_number}: ${chapter.title}`
                : `Глава ${chapterNum}`}
            </h1>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Тема чтения</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {THEMES.map((theme) => (
                      <Button
                        key={theme.name}
                        variant={
                          currentTheme.name === theme.name
                            ? "default"
                            : "outline"
                        }
                        className="justify-start gap-2"
                        onClick={() => setCurrentTheme(theme)}
                      >
                        <theme.icon className="h-4 w-4" />
                        {theme.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Размер шрифта</h4>
                  <Slider
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    min={14}
                    max={28}
                    step={1}
                  />
                  <p className="text-center text-sm mt-2 text-muted-foreground">
                    {fontSize}px
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      {/* Основной контент — с отступом под навбар */}
      <main className="pt-20 container mx-auto max-w-4xl px-4">
        {" "}
        {/* ← pt-20 вместо py-24 */}
        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            {[...Array(20)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : chapter ? (
          <>
            <h1 className="text-4xl font-bold text-center mb-12 mt-8">
              Глава {chapter.chapter_number}: {chapter.title}
            </h1>
            <article
              className="prose prose-lg max-w-none"
              style={{ fontSize: `${fontSize}px`, lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{
                __html: chapter.content.replace(/\n/g, "<br />"),
              }}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="h-32 w-32 mx-auto text-muted-foreground opacity-50 mb-8" />
            <h2 className="text-3xl font-bold mb-4">Глава не найдена</h2>
            <p className="text-xl text-muted-foreground">
              Возможно, глава ещё не добавлена или номер неверный.
            </p>
            <Button
              variant="outline"
              className="mt-8"
              onClick={() => router.back()}
            >
              ← Вернуться к новелле
            </Button>
          </div>
        )}
        {/* Навигация */}
        {!loading && chapter && (
          <div className="mt-20 flex gap-4 justify-center pb-10">
            <Button
              variant="outline"
              size="lg"
              disabled={!hasPrev}
              onClick={() => router.push(`/novel/${novelId}/${chapterNum - 1}`)}
            >
              ← Предыдущая
            </Button>
            <Button
              size="lg"
              onClick={() => router.push(`/novel/${novelId}/${chapterNum + 1}`)}
            >
              Следующая →
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
