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
      <div className="w-full pt-20">
        {/* Carrousel Hero */}
        <section className="w-full relative py-12">
          {/* Image de fond - pleine largeur absolue */}
          <div
            className="fixed inset-0 w-screen h-screen"
            style={{ top: "80px", zIndex: 0 }}
          >
            <Image
              src="/gta-6-leonida-keys-screenshots_h5zt.jpg"
              alt="GTA 6 Leonida Keys Screenshots"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80" />
          </div>

          {/* Contenu du carrousel */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
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
        <section className="w-full py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8">
              {/* Colonne principale - Publications */}
              <div className="flex-1">
                {/* Grille de publications */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Carte Publication 1 - Guide */}
                  <Card className="overflow-hidden border-0 shadow-lg bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      {/* Header avec photo de profil et infos utilisateur */}
                      <div className="p-4 pb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              JD
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-foreground">
                              John Doe
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Il y a 2h
                            </p>
                          </div>
                        </div>

                        {/* Badge type de contenu */}
                        <div className="mt-3">
                          <Badge className="bg-blue-500 text-white border-0 text-xs">
                            Guide
                          </Badge>
                        </div>

                        {/* Titre */}
                        <h3 className="font-bold text-base mt-2 mb-2 line-clamp-2">
                          Guide complet : Installation des mods GTA 6
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          Apprenez à installer et configurer vos mods GTA 6 en
                          toute sécurité. Ce guide étape par étape vous
                          accompagne dans le processus.
                        </p>
                      </div>

                      {/* Image de la publication */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src="/gta6-city.jpg"
                          alt="Guide modding"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Actions interactives */}
                      <div className="p-4 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Bouton Like */}
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-xs">24</span>
                            </button>

                            {/* Bouton Commentaire */}
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs">8</span>
                            </button>

                            {/* Bouton Partage */}
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-green-500 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Bouton Marque-page */}
                          <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Carte Publication 2 - Théorie */}
                  <Card className="overflow-hidden border-0 shadow-lg bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="p-4 pb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              MJ
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-foreground">
                              Marie Johnson
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Il y a 5h
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Badge className="bg-yellow-500 text-white border-0 text-xs">
                            Théorie
                          </Badge>
                        </div>

                        <h3 className="font-bold text-base mt-2 mb-2 line-clamp-2">
                          Théorie : La vraie identité du protagoniste
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3">
                          Analyse approfondie des indices cachés dans les
                          trailers. Le protagoniste pourrait être lié à un
                          personnage de GTA V...
                        </p>
                      </div>

                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src="/gta6-duo.jpg"
                          alt="Théorie GTA 6"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-4 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors">
                              <Heart className="w-4 h-4 fill-current" />
                              <span className="text-xs">156</span>
                            </button>

                            <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs">32</span>
                            </button>

                            <button className="flex items-center gap-1 text-muted-foreground hover:text-green-500 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>

                          <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
                            <svg
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Carte Publication 3 - RP */}
                  <Card className="overflow-hidden border-0 shadow-lg bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="p-4 pb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              AL
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-foreground">
                              Alex Lee
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Il y a 1j
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Badge className="bg-green-500 text-white border-0 text-xs">
                            RP
                          </Badge>
                        </div>

                        <h3 className="font-bold text-base mt-2 mb-2 line-clamp-2">
                          Scénario RP : La Famille Corleone
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3">
                          Nouveau scénario RP mafia complet avec règles,
                          personnages et missions. Devenez le parrain de Los
                          Santos !
                        </p>
                      </div>

                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src="/gta6-profile.jpg"
                          alt="Scénario RP"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-4 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-xs">89</span>
                            </button>

                            <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs">15</span>
                            </button>

                            <button className="flex items-center gap-1 text-muted-foreground hover:text-green-500 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>

                          <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Carte Publication 4 - Événement */}
                  <Card className="overflow-hidden border-0 shadow-lg bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="p-4 pb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              SG
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-foreground">
                              Sarah Garcia
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Il y a 3j
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Badge className="bg-purple-500 text-white border-0 text-xs">
                            Événement
                          </Badge>
                        </div>

                        <h3 className="font-bold text-base mt-2 mb-2 line-clamp-2">
                          Tournoi Racing : Circuit Urbain
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3">
                          Grand tournoi de course communautaire avec récompenses
                          exclusives. Inscriptions ouvertes jusqu'au 20 janvier
                          !
                        </p>
                      </div>

                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src="/gta6-hero.jpg"
                          alt="Tournoi Racing"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-4 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-xs">234</span>
                            </button>

                            <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs">67</span>
                            </button>

                            <button className="flex items-center gap-1 text-muted-foreground hover:text-green-500 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>

                          <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Barre latérale */}
              <div className="w-80 flex-shrink-0 space-y-6">
                {/* Cartes d'annonces et publicités flottantes */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 mt-8">
                  <div className="flex justify-end">
                    <div className="w-80 space-y-4">
                      {/* Carte Annonce importante */}
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                />
                              </svg>
                            </div>
                            <h3 className="font-bold text-lg">
                              Annonce importante
                            </h3>
                          </div>
                          <p className="text-blue-100 mb-4">
                            🎉 Nouvelle fonctionnalité disponible ! Vous pouvez
                            maintenant créer des posts directement depuis la
                            barre latérale.
                          </p>
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                            En savoir plus
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Carte Publicité */}
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-400 to-red-500 text-white">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                              </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">
                              Sponsorisé
                            </h3>
                            <p className="text-orange-100 mb-4">
                              Découvrez les derniers mods premium avec 50% de
                              réduction !
                            </p>
                            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                              Voir l'offre
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                {/* 3. Outils rapides */}
                <Card className="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      Outils rapides
                    </h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Créer un post
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                          />
                        </svg>
                        Mes posts
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        Favoris
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 4. Suggestions de contenu */}
                <Card className="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Suggestions
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            TG
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">
                            Thomas Garcia
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Guide modding avancé
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            LM
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">Lisa Martin</h4>
                          <p className="text-xs text-muted-foreground">
                            Théorie sur les easter eggs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            DC
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">David Chen</h4>
                          <p className="text-xs text-muted-foreground">
                            Événement communautaire
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 5. Tags populaires */}
                <Card className="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Tags populaires
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors">
                        #modding
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer transition-colors">
                        #rp
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer transition-colors">
                        #théorie
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer transition-colors">
                        #événement
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer transition-colors">
                        #racing
                      </Badge>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer transition-colors">
                        #mafia
                      </Badge>
                      <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 cursor-pointer transition-colors">
                        #guide
                      </Badge>
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer transition-colors">
                        #tutoriel
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 6. Liens externes et partenaires */}
                <Card className="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                        />
                      </svg>
                      Liens utiles
                    </h3>
                    <div className="space-y-3">
                      <a
                        href="#"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Twitter</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Discord</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">YouTube</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c.13.013.26.026.39.04-.13.13-.26.26-.39.39-.013-.13-.026-.26-.04-.39-.13.013-.26.026-.39.04.13.13.26.26.39.39.013-.13.026-.26.04-.39zM12 2.4c2.4 0 4.8.8 6.4 2.4.8.8 1.2 1.6 1.6 2.4.4.8.4 1.6.4 2.4 0 .8 0 1.6-.4 2.4-.4.8-.8 1.6-1.6 2.4-1.6 1.6-4 2.4-6.4 2.4s-4.8-.8-6.4-2.4c-.8-.8-1.2-1.6-1.6-2.4-.4-.8-.4-1.6-.4-2.4 0-.8 0-1.6.4-2.4.4-.8.8-1.6 1.6-2.4C7.2 3.2 9.6 2.4 12 2.4z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Partenaires</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AuthProvider>
  );
}
