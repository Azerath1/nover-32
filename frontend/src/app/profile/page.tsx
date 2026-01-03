"use client";

import {
  FaRegUserCircle,
  FaBookOpen,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Шапка профиля */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-8 rounded-2xl bg-background/50 backdrop-blur-xl border border-border/50 shadow-xl">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/20 transition-all group-hover:border-blue-500">
            <FaRegUserCircle className="h-12 w-12 text-blue-500" />
          </div>
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">User_Novera</h1>
          <p className="text-muted-foreground">Читатель с января 2026</p>
          <div className="flex gap-2 justify-center md:justify-start pt-2">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full border border-blue-500/20">
              Премиум
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="md:ml-auto gap-2 text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-500/5"
        >
          <FaSignOutAlt className="h-4 w-4" /> Выйти
        </Button>
      </div>

      {/* Основной контент */}
      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid bg-background/50 border border-border/50">
          <TabsTrigger value="library" className="gap-2">
            <FaBookOpen className="h-4 w-4" /> Библиотека
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <FaHistory className="h-4 w-4" /> История
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <FaCog className="h-4 w-4" /> Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <Card className="bg-background/50 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle>Мои закладки</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="p-4 rounded-full bg-blue-500/5">
                <FaBookOpen className="h-12 w-12 text-blue-500/20" />
              </div>
              <p className="text-muted-foreground">
                В вашей библиотеке пока пусто.
              </p>
              <Button
                variant="outline"
                className="text-blue-500 border-blue-500/20"
              >
                Перейти в каталог
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-background/50 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Имя пользователя</Label>
                <Input
                  id="name"
                  defaultValue="User_Novera"
                  className="max-w-md focus-visible:ring-blue-500/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue="user@example.com"
                  className="max-w-md focus-visible:ring-blue-500/50"
                />
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
