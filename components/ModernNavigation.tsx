"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const { user, signOut } = useAuth();
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
            className="flex items-center gap-3 font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity focus:outline-none focus:ring-0"
          >
            <Image
              src="/logo-site.png"
              alt="VIverse Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              VIverse
            </span>
          </Link>
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="relative group font-bold text-lg tracking-wide hover:text-primary transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 drop-shadow-sm">
                Accueil
              </span>
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 ease-in-out rounded-full shadow-lg"></span>
            </Link>
            {user && (
              <>
                <Link
                  href="/community"
                  className="relative group font-bold text-lg tracking-wide hover:text-primary transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
                >
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300 drop-shadow-sm">
                    Communauté
                  </span>
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300 ease-in-out rounded-full shadow-lg"></span>
                </Link>
                <Link
                  href="/mods"
                  className="relative group font-bold text-lg tracking-wide hover:text-primary transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
                >
                  <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-500 group-hover:to-blue-500 transition-all duration-300 drop-shadow-sm">
                    Mods
                  </span>
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-300 ease-in-out rounded-full shadow-lg"></span>
                </Link>
              </>
            )}
            <Link
              href="/sponsors"
              className="relative group font-bold text-lg tracking-wide hover:text-primary transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            >
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300 drop-shadow-sm">
                Sponsors
              </span>
              <span className="absolute -bottom-2 left-0 w-0 h-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300 ease-in-out rounded-full shadow-lg"></span>
            </Link>
          </div>
          {/* Mobile hamburger menu */}
          <button
            className="md:hidden p-2 rounded hover:bg-muted transition z-50 absolute right-4 top-6 focus:outline-none focus:ring-0"
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
            <div className="ml-4 hidden md:flex items-center gap-3">
              <Link href="/profile">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                  <AvatarFallback>
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
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
              className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-all duration-300 p-3 rounded-lg hover:bg-muted/50 drop-shadow-sm focus:outline-none focus:ring-0"
            >
              Accueil
            </Link>
            {user && (
              <>
                <Link
                  href="/community"
                  onClick={() => setDrawerOpen(false)}
                  className="text-xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all duration-300 p-3 rounded-lg hover:bg-muted/50 drop-shadow-sm focus:outline-none focus:ring-0"
                >
                  Communauté
                </Link>
                <Link
                  href="/mods"
                  onClick={() => setDrawerOpen(false)}
                  className="text-xl font-bold tracking-wide bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent hover:from-green-500 hover:to-blue-500 transition-all duration-300 p-3 rounded-lg hover:bg-muted/50 drop-shadow-sm focus:outline-none focus:ring-0"
                >
                  Mods
                </Link>
              </>
            )}
            <Link
              href="/sponsors"
              onClick={() => setDrawerOpen(false)}
              className="text-xl font-bold tracking-wide bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent hover:from-orange-500 hover:to-red-500 transition-all duration-300 p-3 rounded-lg hover:bg-muted/50 drop-shadow-sm focus:outline-none focus:ring-0"
            >
              Sponsors
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setDrawerOpen(false)}
                  className="text-xl font-bold tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 p-3 rounded-lg hover:bg-muted/50 drop-shadow-sm focus:outline-none focus:ring-0"
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setDrawerOpen(false);
                  }}
                  className="text-xl font-bold tracking-wide bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent hover:from-red-500 hover:to-red-700 transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 drop-shadow-sm focus:outline-none focus:ring-0 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setDrawerOpen(false)}
                className="text-xl font-bold tracking-wide bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent hover:from-green-500 hover:to-blue-500 transition-all duration-300 p-3 rounded-lg hover:bg-muted/50 drop-shadow-sm focus:outline-none focus:ring-0"
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
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-background border border-border hover:bg-muted transition-colors focus:outline-none focus:ring-0"
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
