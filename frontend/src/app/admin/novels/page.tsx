"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNovels, createNovel, getToken, removeToken } from "@/lib/api";

interface Novel {
  id: number;
  title: string;
  description: string;
  author: string;
  genre: string;
  status: string;
  rating: number;
  owner_id: number;
}

export default function NovelsAdminPage() {
  const router = useRouter();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    genre: "",
    status: "Ongoing",
    rating: 0,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoggedIn(true);

    async function fetchNovels() {
      try {
        const data = await getNovels();
        setNovels(data);
      } catch {
        alert("Ошибка загрузки новелл");
      } finally {
        setLoading(false);
      }
    }

    fetchNovels();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newNovel = await createNovel(formData);
      setNovels([...novels, newNovel]);
      setFormData({
        title: "",
        description: "",
        author: "",
        genre: "",
        status: "Ongoing",
        rating: 0,
      });
      alert("Новелла успешно добавлена!");
    } catch (error: unknown) {
      // ← вместо any → unknown
      if (error instanceof Error) {
        alert(error.message || "Ошибка при создании новеллы");
      } else {
        alert("Неизвестная ошибка при создании новеллы");
      }
    }
  };

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto py-10 text-center">
        Проверяем авторизацию...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление новеллами</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-red-600"
        >
          Выйти
        </Button>
      </div>

      {/* Форма создания */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Добавить новую новеллу</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Автор</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Жанр</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Ongoing">Онгоинг</option>
                <option value="Completed">Завершено</option>
                <option value="Paused">На паузе</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Описание</Label>
              <textarea
                id="description"
                className="w-full min-h-32 px-3 py-2 rounded-md border border-input bg-background"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Добавить новеллу
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Список */}
      <h2 className="text-2xl font-bold mb-6">Все новеллы ({novels.length})</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : novels.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Новелл пока нет. Добавьте первую!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.map((novel) => (
            <Card key={novel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{novel.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Автор: {novel.author || "Неизвестен"} • Жанр:{" "}
                  {novel.genre || "Не указан"}
                </p>
                <p className="text-sm mb-4 line-clamp-3">
                  {novel.description || "Нет описания"}
                </p>

                <div className="flex gap-2 mt-4">
                  <Link href={`/novel/${novel.id}`}>
                    <Button variant="outline" size="sm">
                      Просмотр
                    </Button>
                  </Link>
                  <Link href={`/admin/novels/${novel.id}/chapters`}>
                    <Button size="sm">Главы</Button>
                  </Link>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{novel.status}</span>
                  <Link href={`/novel/${novel.id}`}>
                    <Button variant="outline" size="sm">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
