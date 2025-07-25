"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Navigation principale */}
      <header className="fixed top-0 left-0 w-full z-30 bg-background/70 backdrop-blur border-b border-border">
        <nav className="container mx-auto flex items-center justify-between h-20 px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              GTA 6 Mods
            </span>
          </Link>
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link
              href="/community"
              className="hover:text-primary transition-colors"
            >
              Communauté
            </Link>
            <Link href="/mods" className="hover:text-primary transition-colors">
              Mods
            </Link>
            <Link
              href="/sponsors"
              className="hover:text-primary transition-colors"
            >
              Sponsors
            </Link>
          </div>
          {/* Mobile hamburger menu */}
          <button
            className="md:hidden p-2 rounded hover:bg-muted transition z-50 absolute right-4 top-6"
            onClick={() => setDrawerOpen(true)}
            aria-label="Ouvrir le menu"
            style={{ background: "rgba(20,20,20,0.8)" }}
          >
            <Menu className="w-7 h-7" />
          </button>
          {/* Profil/avatar */}
          {!user ? (
            <Link
              href="/login"
              className="ml-4 px-4 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 transition-colors hidden md:inline-block"
            >
              Se connecter
            </Link>
          ) : (
            <Link href="/profile" className="ml-4 hidden md:inline-block">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback>
                  {user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </nav>
      </header>
      {/* Drawer menu mobile */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-4 p-4">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="text-lg font-semibold"
            >
              Accueil
            </Link>
            <Link
              href="/community"
              onClick={() => setDrawerOpen(false)}
              className="text-lg font-semibold"
            >
              Communauté
            </Link>
            <Link
              href="/mods"
              onClick={() => setDrawerOpen(false)}
              className="text-lg font-semibold"
            >
              Mods
            </Link>
            <Link
              href="/sponsors"
              onClick={() => setDrawerOpen(false)}
              className="text-lg font-semibold"
            >
              Sponsors
            </Link>
            {user ? (
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className="text-lg font-semibold"
              >
                Profil
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setDrawerOpen(false)}
                className="text-lg font-semibold"
              >
                Se connecter
              </Link>
            )}
            <DrawerClose />
          </div>
        </DrawerContent>
      </Drawer>
      {/* Bouton dark mode flottant en bas à droite */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-background border border-border hover:bg-muted transition-colors"
          title="Changer de thème"
        >
          {theme === "dark" ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-blue-600" />
          )}
        </button>
      )}
    </>
  );
}
