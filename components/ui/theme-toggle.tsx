"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="size-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" && <Moon className="size-4" />}
      {theme === "light" && <Sun className="size-4" />}
      {theme === "system" && <Monitor className="size-4" />}
    </Button>
  );
}
