"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import NovelCard from "./NovelCard";
import { POPULAR_NOVELS, TOP_DAY_NOVELS } from "@/lib/novels-data";

export default function NovelsSections() {
  const autoplayOptions = { delay: 6000, stopOnInteraction: false };

  const popularPlugin = React.useRef(Autoplay(autoplayOptions));
  const topDayPlugin = React.useRef(Autoplay(autoplayOptions));

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900">
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
          {POPULAR_NOVELS.map((novel) => (
            <CarouselItem
              key={novel.id}
              className="pl-2 md:pl-3 basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]"
            >
              <NovelCard
                id={novel.id}
                slug={novel.slug}
                title={novel.title}
                image={novel.image}
                chapters={novel.chapters}
                genre={novel.genre}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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
          {TOP_DAY_NOVELS.map((novel) => (
            <CarouselItem
              key={novel.id}
              className="pl-2 md:pl-3 basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]"
            >
              <NovelCard
                id={novel.id}
                slug={novel.slug}
                title={novel.title}
                image={novel.image}
                chapters={novel.chapters}
                genre={novel.genre}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
