"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { POPULAR_NOVELS, TOP_DAY_NOVELS } from "@/lib/novels-data";

export function Search() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Используем useMemo для объединения списков один раз
  const allNovels = useMemo(() => [...POPULAR_NOVELS, ...TOP_DAY_NOVELS], []);

  // Фильтруем результаты на лету. Это эффективнее и убирает ошибку setState-in-effect
  const results = useMemo(() => {
    if (query.length < 2) return [];
    return allNovels
      .filter((novel) =>
        novel.title.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }, [query, allNovels]);

  // Закрытие при клике вне поиска
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/novel/${slug}`);
  };

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск новелл..."
          className="h-9 w-full rounded-md border bg-muted/50 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Выпадающий список результатов */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border bg-popover p-2 shadow-xl z-50">
          {results.length > 0 ? (
            results.map((novel) => (
              <button
                key={novel.id}
                onClick={() => handleSelect(novel.slug)}
                className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors text-left"
              >
                <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded">
                  <Image
                    src={novel.image}
                    alt={novel.title}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium line-clamp-1">
                    {novel.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {novel.genre}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}
