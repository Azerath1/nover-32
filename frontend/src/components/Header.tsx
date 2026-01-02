"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Menu } from "lucide-react";
// Используем React Icons для более детальных логотипов
import { FaRegUserCircle } from "react-icons/fa";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search } from "@/components/Search";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Логотип с эффектом наклона и масштаба */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold text-blue-500 transition-all"
        >
          <BookOpen className="h-6 w-6 transition-transform duration-300 group-hover:rotate-15 group-hover:scale-110" />
          <span className="tracking-tight">Novera</span>
        </Link>

        {/* Десктопная навигация */}
        <nav className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50">
                  Каталог
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2">
                    <ListItem href="/catalog/all" title="Все новеллы">
                      Исследуйте нашу полную библиотеку произведений.
                    </ListItem>
                    <ListItem href="/catalog/popular" title="Популярное">
                      То, что читают все прямо сейчас.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="group h-10 w-max inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-blue-500"
                >
                  <Link href="/ranking">Рейтинг</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Правая часть управления */}
        <div className="flex items-center gap-3">
          {/* Поиск */}
          <div className="hidden sm:block">
            <Search />
          </div>

          {/* Переключатель темы (уже настроен нами на h-9) */}
          <ThemeToggle />

          {/* Кнопка "Войти" — Гибрид вариантов 2 и 3 */}
          <Button
            variant="ghost"
            className="relative group h-9 px-5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition-all duration-300 overflow-hidden hidden sm:flex"
          >
            <div className="flex items-center gap-2 relative z-10">
              <FaRegUserCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
              <span className="font-medium">Войти</span>
            </div>
            {/* Анимированная линия подчеркивания */}
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </Button>

          {/* Мобильное меню (Гамбургер) */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="group">
                <Menu className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100">
              <nav className="flex flex-col gap-6 mt-10">
                <Search />
                <div className="flex flex-col gap-3">
                  <Link
                    href="/catalog"
                    className="text-lg font-medium hover:text-blue-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Каталог
                  </Link>
                  <Link
                    href="/ranking"
                    className="text-lg font-medium hover:text-blue-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Рейтинг
                  </Link>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Войти
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-blue-500/5 hover:text-blue-500 focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
