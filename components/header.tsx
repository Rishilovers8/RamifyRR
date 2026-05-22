"use client";

import { Play } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">RamifyRR</h1>
            <p className="text-xs text-muted-foreground">Video Translation</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
