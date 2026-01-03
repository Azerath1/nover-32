"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Menu, LogOut, User, Settings } from "lucide-react";
import { FaRegUserCircle } from "react-icons/fa";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search } from "@/components/Search";
import { getToken, removeToken } from "@/lib/api";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  // Состояние: null — ещё не известно, false — не залогинен, true — залогинен
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);

  // Проверяем токен только на клиенте после монтирования
  React.useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Логотип */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold text-blue-500 transition-all"
        >
          <BookOpen className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          <span className="tracking-tight">Novera</span>
        </Link>

        {/* Центральная часть: Каталог + Поиск */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          {/* Каталог */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 text-base">
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
            </NavigationMenuList>
          </NavigationMenu>

          {/* Поиск */}
          <div className="max-w-md flex-1">
            <Search />
          </div>
        </div>

        {/* Правая часть: Тема + Профиль/Вход */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Десктоп: Профиль или Вход */}
          <div className="hidden md:block">
            {isLoggedIn === null ? (
              // Заглушка, чтобы избежать hydration mismatch
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <FaRegUserCircle className="h-6 w-6 text-blue-500" />
                    <span className="sr-only">Профиль</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/novels"
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Управление новеллами
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile#settings"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Настройки
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-blue-500 hover:bg-blue-600">
                <Link href="/login">Войти</Link>
              </Button>
            )}
          </div>

          {/* Мобильное меню */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-6 mt-8">
                <div className="px-4">
                  <Search />
                </div>

                {isLoggedIn === null ? null : isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 text-blue-500 border border-blue-500/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaRegUserCircle className="h-6 w-6" />
                      <span className="font-semibold text-lg">Мой профиль</span>
                    </Link>

                    <Link
                      href="/admin/novels"
                      className="text-lg font-medium p-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Управление новеллами
                    </Link>

                    <Button
                      variant="outline"
                      className="border-red-500/20 text-red-500 w-full"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </Button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-blue-500 text-white">
                      Войти
                    </Button>
                  </Link>
                )}

                <Link
                  href="/catalog"
                  className="text-lg font-medium p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Каталог
                </Link>
                <Link
                  href="/ranking"
                  className="text-lg font-medium p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Рейтинг
                </Link>

                <div className="mt-6">
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// ListItem — без изменений
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
