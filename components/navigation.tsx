"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Bell,
  User,
  Settings,
  LogOut,
  Home,
  Gamepad2,
  FileText,
  Video,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import AdminBadge from "./AdminBadge";

export function Navigation() {
  const { user, userProfile } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">VIverse</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 text-sm font-medium hover:text-primary"
            >
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </Link>
            <Link
              href="/mods"
              className="flex items-center space-x-1 text-sm font-medium hover:text-primary"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Mods</span>
            </Link>
            <Link
              href="/guides"
              className="flex items-center space-x-1 text-sm font-medium hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              <span>Guides</span>
            </Link>
            <Link
              href="/videos"
              className="flex items-center space-x-1 text-sm font-medium hover:text-primary"
            >
              <Video className="h-4 w-4" />
              <span>Vidéos</span>
            </Link>
            <Link
              href="/theories"
              className="flex items-center space-x-1 text-sm font-medium hover:text-primary"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Théories</span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher mods, guides, vidéos..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Publier
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/submit">Contenu général</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/submit-mod">Mod</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>

            <div className="flex items-center gap-2">
              {userProfile?.role && userProfile.role !== "user" && (
                <AdminBadge role={userProfile.role} size="sm" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatar_url || "/placeholder-user.jpg"} alt="@user" />
                      <AvatarFallback>{userProfile?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
