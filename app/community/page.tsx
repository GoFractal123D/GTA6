"use client";
import CommunityForm from "@/components/CommunityForm";
import CommunityFeed from "@/components/CommunityFeed";
import { AuthProvider } from "@/components/AuthProvider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Trophy,
  Calendar,
  Star,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const carouselItems = [
  {
    id: 1,
    title: "Tournoi Racing GTA 6",
    subtitle: "Compétition communautaire",
    description:
      "Participez au plus grand tournoi de course de la communauté GTA 6. Récompenses exclusives à gagner !",
    image: "/gta6-hero.jpg",
    badge: "Événement",
    badgeColor: "bg-purple-500",
    stats: {
      participants: 156,
      prize: "500€",
      date: "15 Jan 2025",
    },
    icon: Trophy,
    color: "text-purple-500",
  },
  {
    id: 2,
    title: "Guide Modding Avancé",
    subtitle: "Tutoriel complet",
    description:
      "Apprenez à créer des mods professionnels pour GTA 6 avec notre guide étape par étape.",
    image: "/gta6-city.jpg",
    badge: "Guide",
    badgeColor: "bg-blue-500",
    stats: {
      views: 1247,
      likes: 89,
      comments: 23,
    },
    icon: Users,
    color: "text-blue-500",
  },
  {
    id: 3,
    title: "Théorie : La Fin Secrète",
    subtitle: "Spéculation communautaire",
    description:
      "Découvrez les théories les plus folles sur la fin cachée de GTA 6. Que se cache-t-il vraiment ?",
    image: "/gta6-duo.jpg",
    badge: "Théorie",
    badgeColor: "bg-yellow-500",
    stats: {
      views: 892,
      likes: 67,
      comments: 45,
    },
    icon: Star,
    color: "text-yellow-500",
  },
  {
    id: 4,
    title: "Scénario RP Mafia",
    subtitle: "Roleplay immersif",
    description:
      "Plongez dans l'univers de la mafia avec notre scénario RP complet. Devenez le parrain !",
    image: "/gta6-profile.jpg",
    badge: "RP",
    badgeColor: "bg-green-500",
    stats: {
      players: 34,
      sessions: 12,
      rating: 4.8,
    },
    icon: Heart,
    color: "text-green-500",
  },
];

const filterCategories = [
  { id: "all", label: "Tous", icon: TrendingUp, color: "text-gray-500" },
  { id: "guide", label: "Guide", icon: Users, color: "text-blue-500" },
  { id: "theory", label: "Théorie", icon: Star, color: "text-yellow-500" },
  { id: "rp", label: "RP", icon: Heart, color: "text-green-500" },
  { id: "event", label: "Event", icon: Calendar, color: "text-purple-500" },
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getSearchPlaceholder = () => {
    switch (selectedCategory) {
      case "guide":
        return "Rechercher un guide...";
      case "theory":
        return "Rechercher une théorie...";
      case "rp":
        return "Rechercher un scénario RP...";
      case "event":
        return "Rechercher un événement...";
      default:
        return "Rechercher dans la communauté...";
    }
  };

  return (
    <AuthProvider>
      <div className="w-full">
        {/* Carrousel Hero */}
        <section className="w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Communauté GTA 6
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                Découvrez, partagez et participez à la plus grande communauté de
                moddeurs et joueurs GTA 6
              </p>
            </div>

            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {carouselItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CarouselItem
                      key={item.id}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="overflow-hidden border-0 shadow-2xl bg-background/90 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <Badge
                            className={`absolute top-4 left-4 ${item.badgeColor} text-white border-0`}
                          >
                            {item.badge}
                          </Badge>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-purple-200">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${item.color}`} />
                              {item.badge === "Événement" ? (
                                <span className="text-xs text-muted-foreground">
                                  {item.stats.participants} participants
                                </span>
                              ) : item.badge === "Guide" ? (
                                <span className="text-xs text-muted-foreground">
                                  {item.stats.views} vues
                                </span>
                              ) : item.badge === "Théorie" ? (
                                <span className="text-xs text-muted-foreground">
                                  {item.stats.likes} likes
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {item.stats.players} joueurs
                                </span>
                              )}
                            </div>
                            {item.badge === "Événement" && (
                              <div className="text-right">
                                <div className="text-xs text-purple-500 font-semibold">
                                  Récompense: {item.stats.prize}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.stats.date}
                                </div>
                              </div>
                            )}
                          </div>

                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                            Voir plus
                          </Button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-0 shadow-lg" />
              <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-0 shadow-lg" />
            </Carousel>
          </div>
        </section>

        {/* Navigation et Filtres */}
        <section className="w-full bg-background/50 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Filtres par catégorie */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {filterCategories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg border-primary"
                          : "bg-background/80 text-muted-foreground hover:bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${category.color}`} />
                      {category.label}
                    </button>
                  );
                })}
              </div>

              {/* Barre de recherche */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={getSearchPlaceholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/80 backdrop-blur-sm border-border focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-8 py-12 px-4">
          <CommunityForm />
          <CommunityFeed />
        </div>
      </div>
    </AuthProvider>
  );
}
