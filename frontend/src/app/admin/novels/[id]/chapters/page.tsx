"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function ChaptersAdminPage() {
  const params = useParams();
  const router = useRouter();
  const novelId = params.id as string;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    chapter_number: 1,
  });

  useEffect(() => {
    async function fetchChapters() {
      try {
        const res = await fetch(`${API_URL}/novels/${novelId}/chapters/`);
        if (res.ok) {
          const data = await res.json();
          setChapters(data);
        }
      } catch (error) {
        console.error("Ошибка загрузки глав:", error);
        alert("Ошибка загрузки глав");
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [novelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Токен не найден. Войдите заново.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/novels/${novelId}/chapters/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newChapter = await res.json();
        setChapters([...chapters, newChapter]);
        setFormData({
          title: "",
          content: "",
          chapter_number: chapters.length + 2,
        });
        alert("Глава добавлена!");
      } else {
        const errData = await res.json();
        alert(errData.detail || "Ошибка добавления главы");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Ошибка сети при добавлении главы");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← Назад
        </Button>
        <h1 className="text-3xl font-bold">Главы новеллы #{novelId}</h1>
      </div>

      {/* Форма */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Добавить главу</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Название главы</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="number">Номер главы</Label>
                <Input
                  id="number"
                  type="number"
                  required
                  value={formData.chapter_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chapter_number: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content">Текст главы</Label>
              <textarea
                id="content"
                required
                rows={10}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Добавить главу
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Список глав */}
      <h2 className="text-2xl font-bold mb-6">
        Список глав ({chapters.length})
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : chapters.length === 0 ? (
        <p className="text-center text-muted-foreground">Глав пока нет</p>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <Card key={chapter.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>
                    Глава {chapter.chapter_number}: {chapter.title}
                  </span>
                  <Link href={`/novel/${novelId}/${chapter.chapter_number}`}>
                    <Button variant="outline" size="sm">
                      Читать
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {chapter.content.substring(0, 200)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
