"use client";

import React, { useState, useEffect } from "react"; // ← Добавили React
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import NovelCard from "./NovelCard";
import { getNovels } from "@/lib/api";

interface Novel {
  id: number;
  title: string;
  description?: string;
  author?: string;
  genre?: string;
  status?: string;
  rating?: number;
  image?: string;
}

export default function NovelsSections() {
  const [popularNovels, setPopularNovels] = useState<Novel[]>([]);
  const [topDayNovels, setTopDayNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  const autoplayOptions = { delay: 5000, stopOnInteraction: false };
  const popularPlugin = React.useRef(Autoplay(autoplayOptions));
  const topDayPlugin = React.useRef(Autoplay(autoplayOptions));

  useEffect(() => {
    async function loadNovels() {
      try {
        const novels: Novel[] = await getNovels();

        if (novels.length === 0) {
          setLoading(false);
          return;
        }

        // Сортируем по rating (или по id, если rating нет)
        const sorted = [...novels].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );

        // Первые 8 — Популярные
        setPopularNovels(sorted.slice(0, 8));

        // Следующие 8 — Топ дня
        setTopDayNovels(sorted.slice(8, 16));
      } catch (err) {
        console.error("Ошибка загрузки новелл:", err);
        alert("Не удалось загрузить новеллы с сервера");
      } finally {
        setLoading(false);
      }
    }

    loadNovels();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg">Загрузка новелл...</p>
      </div>
    );
  }

  if (popularNovels.length === 0 && topDayNovels.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Новелл пока нет. Добавьте первую в админке!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900">
      {/* Популярные */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Популярные
      </h2>
      <Carousel
        plugins={[popularPlugin.current]}
        opts={{ align: "start", loop: true }}
        className="w-full"
        onMouseEnter={popularPlugin.current.stop}
        onMouseLeave={popularPlugin.current.reset}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {popularNovels.map((novel) => (
            <CarouselItem
              key={novel.id}
              className="pl-2 md:pl-3 basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]"
            >
              <NovelCard
                id={novel.id}
                slug={novel.id.toString()}
                title={novel.title}
                image="/cover.png"
                chapters={0}
                genre={novel.genre || "Неизвестно"}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Топ Дня */}
      {topDayNovels.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">
            Топ Дня
          </h2>
          <Carousel
            plugins={[topDayPlugin.current]}
            opts={{ align: "start", loop: true }}
            className="w-full"
            onMouseEnter={topDayPlugin.current.stop}
            onMouseLeave={topDayPlugin.current.reset}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {topDayNovels.map((novel) => (
                <CarouselItem
                  key={novel.id}
                  className="pl-2 md:pl-3 basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]"
                >
                  <NovelCard
                    id={novel.id}
                    slug={novel.id.toString()}
                    title={novel.title}
                    image="/cover.png"
                    chapters={0}
                    genre={novel.genre || "Неизвестно"}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </>
      )}
    </div>
  );
}
