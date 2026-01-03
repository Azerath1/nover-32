"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  Star,
  Eye,
  Bookmark,
  Share2,
} from "lucide-react";

const API_URL = "http://localhost:8000";

interface Novel {
  id: number;
  title: string;
  description: string | null;
  author: string | null;
  genre: string | null;
  status: string;
  rating: number;
  chapters: Chapter[];
}

interface Chapter {
  id: number;
  title: string;
  chapter_number: number;
}

interface UserNovelStatus {
  novel_id: number;
  status: string;
}

const STATUS_OPTIONS = [
  {
    value: "reading",
    label: "Читаю",
    icon: BookOpen,
    color: "bg-blue-500 text-white",
  },
  {
    value: "will_read",
    label: "Буду читать",
    icon: Clock,
    color: "bg-yellow-500 text-white",
  },
  {
    value: "completed",
    label: "Прочёл",
    icon: CheckCircle,
    color: "bg-green-500 text-white",
  },
  {
    value: "dropped",
    label: "Брошено",
    icon: XCircle,
    color: "bg-red-500 text-white",
  },
];

export default function NovelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const novelId = parseInt(slug);

  const [novel, setNovel] = useState<Novel | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNovel() {
      try {
        const res = await fetch(`${API_URL}/novels/${novelId}`);
        if (!res.ok) throw new Error("Novel not found");
        const data: Novel = await res.json();
        setNovel(data);
      } catch {
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchNovel();
  }, [novelId]);

  // Загружаем статус пользователя — с безопасной проверкой
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !novel) return;

    fetch(`${API_URL}/user/novels/status/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          console.warn("Не удалось загрузить статусы закладок");
          return [];
        }
        return res.json();
      })
      .then((data) => {
        // Защита: если data не массив — делаем пустым массивом
        const statuses = Array.isArray(data) ? data : [];
        const statusObj = statuses.find(
          (s: UserNovelStatus) => s.novel_id === novel.id
        );
        if (statusObj) setUserStatus(statusObj.status);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке статусов:", err);
      });
  }, [novel]);

  const setStatus = async (newStatus: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Войдите в аккаунт, чтобы добавить в закладки");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/novels/${novel!.id}/status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setUserStatus(newStatus);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || "Ошибка при сохранении статуса");
      }
    } catch {
      alert("Ошибка сети");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20">
        <Skeleton className="h-96 w-full mb-8" />
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
    );
  }

  if (!novel) return notFound();

  const isLiked = userStatus === "liked";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Hero */}
      <div className="relative w-full overflow-hidden bg-gray-900 text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/cover.png"
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
            <div className="shrink-0 mx-auto md:mx-0 w-60 md:w-80">
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg shadow-2xl border-4 border-white/10">
                <Image
                  src="/cover.png"
                  alt={novel.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Информация */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{novel.title}</h1>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <span>Автор: {novel.author || "Неизвестен"}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Статус: {novel.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="text-lg font-semibold">
                    {novel.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span>Просмотров: ?</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  <span>В закладках: ?</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {novel.genre && (
                  <Badge variant="secondary">{novel.genre}</Badge>
                )}
              </div>

              <p className="text-lg leading-relaxed opacity-95">
                {novel.description || "Описание отсутствует."}
              </p>

              {/* Кнопки закладок */}
              <div className="flex flex-wrap gap-3">
                {STATUS_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = userStatus === opt.value;
                  return (
                    <Button
                      key={opt.value}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatus(opt.value)}
                      className={isActive ? opt.color : ""}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {opt.label}
                    </Button>
                  );
                })}

                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus(isLiked ? "will_read" : "liked")}
                  className={isLiked ? "bg-red-500 text-white" : ""}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Нравится" : "Нравится"}
                </Button>
              </div>

              <div className="flex gap-4">
                <Button variant="secondary" size="lg">
                  <Bookmark className="h-5 w-5 mr-2" />В закладки
                </Button>
                <Button variant="secondary" size="lg">
                  <Share2 className="h-5 w-5 mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="chapters" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="chapters">Главы</TabsTrigger>
            <TabsTrigger value="comments">Комментарии</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <div className="prose prose-invert max-w-none">
              <p>{novel.description || "Описание отсутствует."}</p>
            </div>
          </TabsContent>

          <TabsContent value="chapters" className="mt-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border">
              <h3 className="font-bold mb-6 flex items-center gap-2 text-xl">
                <BookOpen className="w-6 h-6 text-blue-500" />
                Список глав
              </h3>
              {novel.chapters.length > 0 ? (
                <div className="space-y-3">
                  {novel.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/novel/${novel.id}/${chapter.chapter_number}`}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        Глава {chapter.chapter_number}: {chapter.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Главы пока не добавлены
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-8">
            <p className="text-center text-muted-foreground">
              Комментарии скоро будут!
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
