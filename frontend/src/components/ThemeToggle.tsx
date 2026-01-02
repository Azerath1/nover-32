"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Заглушка (Skeleton) теперь тоже h-9, чтобы верстка не прыгала
  if (!mounted) {
    return (
      <div className="flex h-9 items-center gap-1 bg-muted/50 p-1 rounded-md border border-border/50">
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div className="flex h-9 items-center gap-2 bg-muted/50 p-1 rounded-md border border-border/50">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        className="h-7 w-7 rounded-sm transition-all group" // Высота 7, чтобы влезло в контейнер h-9
      >
        <Sun className="h-3.5 w-3.5 transition-colors duration-300 group-hover:text-blue-500" />
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        className="h-7 w-7 rounded-sm transition-all group"
      >
        <Moon className="h-3.5 w-3.5 transition-colors duration-300 group-hover:text-blue-500" />
      </Button>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        className="h-7 w-7 rounded-sm transition-all group"
      >
        <Monitor className="h-3.5 w-3.5 transition-colors duration-300 group-hover:text-blue-500" />
      </Button>
    </div>
  );
}
