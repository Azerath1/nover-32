export interface Novel {
  id: number;
  slug: string;
  title: string;
  image: string;
  rating: number;
  ratingCount: number;
  chapters: number;
  genre: string; // Основной жанр для карточки
  genres: string[]; // Полный список для страницы
  tags: string[];
  author: string;
  status: string;
  year: number;
  views: number;
  bookmarks: number;
  description: string;
  chapterList: {
    title: string;
    date: string;
    translator: string;
    content?: string;
  }[]; // Переименовал для ясности
}

export const POPULAR_NOVELS: Novel[] = [
  {
    id: 1,
    slug: "zachem-mne-sovershenstvovat",
    title: "Зачем мне совершенствовать...",
    image: "/cover.png",
    rating: 4.8,
    ratingCount: 1200,
    chapters: 150,
    genre: "Фэнтези",
    genres: ["Фэнтези", "Приключения"],
    tags: ["Перерождение", "Система"],
    author: "Автор 1",
    status: "Онгоинг",
    year: 2023,
    views: 50000,
    bookmarks: 3000,
    description:
      "Описание новеллы: Герой перерождается в мире с системой и начинает путь к совершенству...",
    chapterList: [
      {
        title: "Глава 1: Начало пути",
        date: "2024-01-01",
        translator: "Novera Team",
        content:
          "Это текст первой главы. Герой проснулся в незнакомом месте...",
      },
      {
        title: "Глава 2: Новые силы",
        date: "2024-01-02",
        translator: "Novera Team",
        content:
          "Текст второй главы. Здесь герой обнаруживает у себя магические способности и систему.",
      },
    ],
  },
  {
    id: 2,
    slug: "naruto-robota-v-gostinne",
    title: "Наруто: Робота в гостинне...",
    image: "/cover.png",
    rating: 4.7,
    ratingCount: 900,
    chapters: 200,
    genre: "Фанфик",
    genres: ["Фанфик", "Экшн"],
    tags: ["Наруто", "Альтернативная история"],
    author: "Автор 2",
    status: "Завершено",
    year: 2022,
    views: 40000,
    bookmarks: 2500,
    description: "Фанфик по Наруто...",
    chapterList: [
      { title: "Глава 1", date: "2022-01-01", translator: "Переводчик 2" },
      // ...
    ],
  },
  // Добавь остальные 6 для популярных, аналогично с уникальными slug, genres, tags и т.д.
  // Для примера повторю шаблон, но измени данные в реальном проекте
  {
    id: 3,
    slug: "sistema-shanelyu",
    title: "Система Шанелью...",
    image: "/cover.png",
    rating: 4.9,
    ratingCount: 1500,
    chapters: 120,
    genre: "ЛитРПГ",
    genres: ["ЛитРПГ"],
    tags: [],
    author: "Автор 3",
    status: "Онгоинг",
    year: 2024,
    views: 60000,
    bookmarks: 3500,
    description: "...",
    chapterList: [],
  },
  {
    id: 4,
    slug: "podzeme-maister-sinteza",
    title: "Подземелье: Мастер Синтеза...",
    image: "/cover.png",
    rating: 4.6,
    ratingCount: 800,
    chapters: 180,
    genre: "Фэнтези",
    genres: ["Фэнтези"],
    tags: [],
    author: "Автор 4",
    status: "Онгоинг",
    year: 2023,
    views: 45000,
    bookmarks: 2800,
    description: "...",
    chapterList: [],
  },
  {
    id: 5,
    slug: "bog-obozhaet",
    title: "Бог обожает...",
    image: "/cover.png",
    rating: 4.5,
    ratingCount: 700,
    chapters: 140,
    genre: "Приключения",
    genres: ["Приключения"],
    tags: [],
    author: "Автор 5",
    status: "Завершено",
    year: 2021,
    views: 35000,
    bookmarks: 2000,
    description: "...",
    chapterList: [],
  },
  {
    id: 6,
    slug: "professiya-glavnyy-geroy",
    title: "Профессия: главный герой...",
    image: "/cover.png",
    rating: 4.8,
    ratingCount: 1100,
    chapters: 160,
    genre: "Фанфик",
    genres: ["Фанфик"],
    tags: [],
    author: "Автор 6",
    status: "Онгоинг",
    year: 2024,
    views: 55000,
    bookmarks: 3200,
    description: "...",
    chapterList: [],
  },
  {
    id: 7,
    slug: "naruto-belyy-klyk",
    title: "Наруто: Белый Клык",
    image: "/cover.png",
    rating: 4.9,
    ratingCount: 1300,
    chapters: 130,
    genre: "Наруто",
    genres: ["Наруто"],
    tags: [],
    author: "Автор 7",
    status: "Завершено",
    year: 2022,
    views: 48000,
    bookmarks: 2900,
    description: "...",
    chapterList: [],
  },
  {
    id: 8,
    slug: "ya-imperator",
    title: "Я - Император!",
    image: "/cover.png",
    rating: 4.7,
    ratingCount: 1000,
    chapters: 170,
    genre: "Император",
    genres: ["Император"],
    tags: [],
    author: "Автор 8",
    status: "Онгоинг",
    year: 2023,
    views: 52000,
    bookmarks: 3100,
    description: "...",
    chapterList: [],
  },
];

export const TOP_DAY_NOVELS: Novel[] = [
  {
    id: 9,
    slug: "garri-potter-ya-garri-potter",
    title: "Гарри Поттер: Я Гарри Поттер...",
    image: "/cover.png",
    rating: 4.6,
    ratingCount: 850,
    chapters: 110,
    genre: "Фэнтези",
    genres: ["Фэнтези", "Гарри Поттер"],
    tags: ["Фанфик"],
    author: "Автор 9",
    status: "Онгоинг",
    year: 2024,
    views: 38000,
    bookmarks: 2200,
    description: "Фанфик по Гарри Поттеру...",
    chapterList: [
      { title: "Глава 1", date: "2024-01-01", translator: "Переводчик 9" },
      // ...
    ],
  },
  // Добавь остальные 7 аналогично
  {
    id: 10,
    slug: "voskreshenie-zombi-s-niya",
    title: "Воскрешение зомби с ния",
    image: "/cover.png",
    rating: 4.5,
    ratingCount: 750,
    chapters: 190,
    genre: "Зомби",
    genres: ["Зомби"],
    tags: [],
    author: "Автор 10",
    status: "Завершено",
    year: 2021,
    views: 32000,
    bookmarks: 1800,
    description: "...",
    chapterList: [],
  },
  // ... (для полноты добавь уникальные данные)
];

export function findNovelBySlug(slug: string): Novel | undefined {
  return [...POPULAR_NOVELS, ...TOP_DAY_NOVELS].find((n) => n.slug === slug);
}
