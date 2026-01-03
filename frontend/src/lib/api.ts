// src/lib/api.ts

const API_BASE_URL = "http://localhost:8000";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface NovelData {
  title: string;
  description?: string;
  author?: string;
  genre?: string;
  status?: string;
  rating?: number;
}

// Безопасные функции для работы с localStorage
const isBrowser =
  typeof window !== "undefined" && typeof localStorage !== "undefined";

export const setToken = (token: string) => {
  if (isBrowser) {
    localStorage.setItem("access_token", token);
  }
};

export const getToken = (): string | null => {
  if (isBrowser) {
    return localStorage.getItem("access_token");
  }
  return null;
};

export const removeToken = () => {
  if (isBrowser) {
    localStorage.removeItem("access_token");
  }
};

export const isLoggedIn = (): boolean => {
  return !!getToken();
};

// Регистрация
export const registerUser = async (data: RegisterData) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Ошибка регистрации");
  }
  return res.json();
};

// Логин
export const loginUser = async (data: LoginData) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: data.username,
      password: data.password,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Неверный логин или пароль");
  }
  const result = await res.json();
  setToken(result.access_token);
  return result;
};

// Получить все новеллы
export const getNovels = async () => {
  const res = await fetch(`${API_BASE_URL}/novels/`);
  if (!res.ok) throw new Error("Не удалось загрузить новеллы");
  return res.json();
};

// Получить одну новеллу по ID
export const getNovelById = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/novels/${id}`);
  if (!res.ok) throw new Error("Новелла не найдена");
  return res.json();
};

// Создать новеллу (только авторизованные)
export const createNovel = async (data: NovelData) => {
  const token = getToken();
  if (!token) throw new Error("Требуется авторизация");

  const res = await fetch(`${API_BASE_URL}/novels/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Ошибка создания новеллы");
  }
  return res.json();
};
