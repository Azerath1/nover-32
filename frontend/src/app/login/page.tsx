"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser({ username, password });
      localStorage.setItem("isLoggedIn", "true");
      router.push("/profile");
    } catch (error: unknown) {
      // ← Замени any на unknown
      if (error instanceof Error) {
        alert(error.message || "Ошибка входа");
      } else {
        alert("Неизвестная ошибка при входе");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl">
        <div className="space-y-2 text-center">
          <div className="inline-flex p-3 rounded-full bg-blue-500/10 mb-2">
            <FaRegUserCircle className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">С возвращением</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
