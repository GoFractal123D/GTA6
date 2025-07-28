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
import {
  Users,
  Trophy,
  Calendar,
  Star,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function CommunityPage() {
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

        {/* Contenu principal */}
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-8 py-12 px-4">
          <CommunityForm />
          <CommunityFeed />
        </div>
      </div>
    </AuthProvider>
  );
}
