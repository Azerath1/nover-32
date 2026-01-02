// src/app/novel/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  List,
  Bookmark,
  Eye,
  Share2,
  Clock,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
// Импортируем функцию поиска по slug
import { findNovelBySlug } from "@/lib/novels-data";

export default async function NovelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Ищем новеллу по slug, а не по ID
  const novel = findNovelBySlug(slug);

  if (!novel) {
    return notFound();
  }

  // Заглушки для данных, если их нет
  const tags =
    novel.tags && novel.tags.length > 0
      ? novel.tags
      : ["Фэнтези", "Приключения"];
  const description = novel.description || "Описание временно отсутствует.";
  const author = novel.author || "Неизвестный";
  const status = novel.status || "Онгоинг";
  const year = novel.year || 2024;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* --- HERO SECTION --- */}
      <div className="relative w-full overflow-hidden bg-gray-900 text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={novel.image}
            alt="Background"
            fill
            className="object-cover blur-2xl scale-110"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Обложка */}
            <div className="shrink-0 mx-auto md:mx-0 w-60 md:w-70">
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg shadow-2xl border-4 border-white/10">
                <Image
                  src={novel.image}
                  alt={novel.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <Link href={`/novel/${slug}/1`} className="w-full mt-4 block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-lg shadow-lg shadow-blue-900/20">
                  Читать
                </Button>
              </Link>
            </div>

            {/* Информация */}
            <div className="flex-1 flex flex-col justify-end pb-2">
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                  >
                    {novel.genre}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    {status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    {year} год
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 text-white">
                  {novel.title}
                </h1>

                <div className="flex items-center gap-2 text-gray-300 text-lg">
                  <span className="text-gray-400">Автор:</span>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium border-b border-dashed border-gray-500"
                  >
                    {author}
                  </Link>
                </div>
              </div>

              {/* Статистика */}
              <div className="flex flex-wrap items-center gap-6 md:gap-10 bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 mt-auto">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-yellow-400 text-xl font-bold">
                    <Star className="fill-yellow-400 w-5 h-5" />
                    <span>{novel.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">Рейтинг</span>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-white text-lg font-bold">
                    <List className="w-5 h-5 text-blue-400" />
                    <span>{novel.chapters}</span>
                  </div>
                  <span className="text-xs text-gray-400">Глав</span>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-white text-lg font-bold">
                    <Bookmark className="w-5 h-5 text-green-400" />
                    <span>{novel.bookmarks}</span>
                  </div>
                  <span className="text-xs text-gray-400">В закладках</span>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-white text-lg font-bold">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <span>{novel.views}</span>
                  </div>
                  <span className="text-xs text-gray-400">Просмотров</span>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-200 hover:bg-white/10 hover:text-white bg-transparent"
                >
                  <Bookmark className="w-4 h-4 mr-2" />В закладки
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ТАБЫ --- */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-3 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1">
                <TabsTrigger value="about">Описание</TabsTrigger>
                <TabsTrigger value="chapters">
                  Главы{" "}
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {novel.chapters}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="comments">Комментарии</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Сюжет
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{description}</p>
                  </div>

                  <Separator className="my-6" />

                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-200">
                    Теги
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1"
                      >
                        # {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chapters" className="mt-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Список глав
                    </span>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      Сначала новые
                    </Button>
                  </div>

                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {(novel.chapterList && novel.chapterList.length > 0
                      ? novel.chapterList
                      : Array.from({ length: 5 })
                    ).map((chapter, i) => {
                      // Определяем номер главы: из данных или по индексу
                      const chapterNumber =
                        novel.chapterList && novel.chapterList.length > 0
                          ? novel.chapterList.length - i
                          : novel.chapters - i;

                      return (
                        <Link
                          href={`/novel/${slug}/${chapterNumber}`} // <-- Реальный путь
                          key={i}
                          className="flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors">
                              {/* @ts-expect-error: Mock type check */}
                              {chapter?.title || `Глава ${chapterNumber}`}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              {/* @ts-expect-error: Mock type check */}
                              {chapter?.translator || "Переводчик Novera"}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {/* @ts-expect-error: Mock type check */}
                            {chapter?.date || "Сегодня"}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                  <p className="text-gray-500">
                    Комментарии пока не реализованы
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Правая колонка (Похожие) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Похожее
              </h3>
              <div className="text-sm text-gray-500">
                Здесь будет список похожих новелл
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
