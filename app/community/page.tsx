"use client";
import CommunityForm from "@/components/CommunityForm";
import CommunityFeed from "@/components/CommunityFeed";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
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
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
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
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigationMount } from "@/hooks/use-navigation-mount";

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
  const [stats, setStats] = useState({
    posts: 0,
    members: 0,
    loading: false,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const isMounted = useNavigationMount();
  const [popularTags, setPopularTags] = useState<
    Array<{
      name: string;
      count: number;
      color: string;
    }>
  >([]);
  const [carouselItems, setCarouselItems] = useState<
    Array<{
      id: number;
      title: string;
      subtitle: string;
      description: string;
      image: string;
      badge: string;
      badgeColor: string;
      stats: {
        likes: number;
        comments: number;
        shares: number;
      };
      iconName: string;
      color: string;
      postId: number;
      author: string;
    }>
  >([]);

  useEffect(() => {
    async function fetchStatsAndTags() {
      // Vérifier le cache d'abord
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes
      const CACHE_KEY = "community_data_cache";
      const CACHE_VERSION = "v2"; // Version du cache pour invalidation automatique

      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp, version } = JSON.parse(cachedData);
          const isValid = Date.now() - timestamp < CACHE_DURATION;
          const isCorrectVersion = version === CACHE_VERSION;

          if (isValid && isCorrectVersion) {
            console.log("[Cache] Utilisation des données en cache");
            setStats(data.stats);
            setPopularTags(data.popularTags);
            setCarouselItems(data.carouselItems);
            setIsInitialLoad(false);
            return; // Sortir ici, pas de loading nécessaire
          } else {
            console.log(
              "[Cache] Cache expiré, récupération de nouvelles données"
            );
            localStorage.removeItem(CACHE_KEY);
          }
        } else {
          console.log(
            "[Cache] Aucun cache trouvé, récupération de nouvelles données"
          );
        }
      } catch (error) {
        console.warn("[Cache] Erreur lors de la lecture du cache:", error);
        localStorage.removeItem(CACHE_KEY);
      }

      // Seulement ici, on affiche le loading car on va faire des requêtes réseau
      setStats((s) => ({ ...s, loading: true }));
      try {
        // Vérifier d'abord si Supabase est accessible
        const { data: testData, error: testError } = await supabase
          .from("community")
          .select("id", { count: "exact", head: true })
          .limit(1);

        if (testError) {
          console.warn(
            "Supabase non accessible, utilisation des stats par défaut:",
            testError
          );
          setStats({
            posts: 150,
            members: 1200,
            loading: false,
          });
          setPopularTags([
            {
              name: "#modding",
              count: 45,
              color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
            },
            {
              name: "#rp",
              count: 38,
              color: "bg-green-100 text-green-800 hover:bg-green-200",
            },
            {
              name: "#guide",
              count: 32,
              color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
            },
            {
              name: "#théorie",
              count: 28,
              color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            },
            {
              name: "#événement",
              count: 25,
              color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
            },
            {
              name: "#racing",
              count: 22,
              color: "bg-red-100 text-red-800 hover:bg-red-200",
            },
            {
              name: "#mafia",
              count: 18,
              color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
            },
            {
              name: "#tutoriel",
              count: 15,
              color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
            },
          ]);
          return;
        }

        // Récupérer les statistiques, les tags et les top posts en parallèle
        const [
          { count: postsCount },
          { count: membersCount },
          { data: postsData },
          { data: topPosts },
        ] = await Promise.all([
          supabase
            .from("community")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true }),
          supabase.from("community").select("type, title, content"),
          supabase
            .from("community")
            .select("id, type, title, content, author_id, created_at")
            .order("created_at", { ascending: false }), // Récupérer TOUS les posts pour calculer les likes
        ]);

        setStats({
          posts: postsCount ?? 0,
          members: membersCount ?? 0,
          loading: false,
        });
        setIsInitialLoad(false);

        // Variables pour le cache
        let processedTags: Array<{
          name: string;
          count: number;
          color: string;
        }> = [];
        let processedCarouselData: any[] = [];

        // Traiter les données pour générer les tags populaires
        if (postsData) {
          const tagCounts = new Map<string, number>();
          const tagColors = {
            guide: "bg-pink-100 text-pink-800 hover:bg-pink-200",
            theory: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            rp: "bg-green-100 text-green-800 hover:bg-green-200",
            event: "bg-purple-100 text-purple-800 hover:bg-purple-200",
            modding: "bg-blue-100 text-blue-800 hover:bg-blue-200",
            racing: "bg-red-100 text-red-800 hover:bg-red-200",
            mafia: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
            tutoriel: "bg-orange-100 text-orange-800 hover:bg-orange-200",
          };

          // Compter les types de posts
          postsData.forEach((post) => {
            const type = post.type;
            if (type === "theory") {
              tagCounts.set("#théorie", (tagCounts.get("#théorie") || 0) + 1);
            } else if (type === "event") {
              tagCounts.set(
                "#événement",
                (tagCounts.get("#événement") || 0) + 1
              );
            } else {
              tagCounts.set(`#${type}`, (tagCounts.get(`#${type}`) || 0) + 1);
            }

            // Extraire des mots-clés du titre et contenu
            const text = `${post.title} ${post.content}`.toLowerCase();

            if (text.includes("mod") || text.includes("modding")) {
              tagCounts.set("#modding", (tagCounts.get("#modding") || 0) + 1);
            }
            if (
              text.includes("racing") ||
              text.includes("course") ||
              text.includes("race")
            ) {
              tagCounts.set("#racing", (tagCounts.get("#racing") || 0) + 1);
            }
            if (
              text.includes("mafia") ||
              text.includes("crime") ||
              text.includes("gang")
            ) {
              tagCounts.set("#mafia", (tagCounts.get("#mafia") || 0) + 1);
            }
            if (
              text.includes("tutoriel") ||
              text.includes("tutorial") ||
              text.includes("tuto")
            ) {
              tagCounts.set("#tutoriel", (tagCounts.get("#tutoriel") || 0) + 1);
            }
          });

          // Convertir en tableau et trier par popularité
          const sortedTags = Array.from(tagCounts.entries())
            .map(([name, count]) => ({
              name,
              count,
              color:
                tagColors[name.substring(1) as keyof typeof tagColors] ||
                "bg-gray-100 text-gray-800 hover:bg-gray-200",
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Garder seulement les 8 plus populaires

          setPopularTags(sortedTags);
          processedTags = sortedTags;
        }

        // Fonction utilitaire pour sélectionner l'image selon la catégorie
        const getImageForCategory = (category: string) => {
          switch (category) {
            case "guide":
              return "/Femme.jpg";
            case "theory":
              return "/Conspiration.jpg";
            case "rp":
              return "/Soldat.jpg";
            case "event":
              return "/Evenement.jpg";
            default:
              return "/";
          }
        };

        // Traiter les top posts pour le carrousel
        if (topPosts && topPosts.length > 0) {
          console.log("[Carrousel] Posts récupérés:", topPosts.length);
          console.log("[Carrousel] Posts détails:", topPosts);

          // Récupérer les likes pour tous les posts
          const postIds = topPosts.map((post) => post.id);
          console.log("[Carrousel] PostIds pour likes:", postIds);

          const { data: likesData } = await supabase
            .from("post")
            .select("post_id")
            .in("post_id", postIds)
            .eq("action_type", "like");

          console.log("[Carrousel] Likes data:", likesData);

          // Récupérer les commentaires
          const { data: commentsData } = await supabase
            .from("community_comments")
            .select("post_id")
            .in("post_id", postIds);

          // Récupérer les partages
          const { data: sharesData } = await supabase
            .from("post")
            .select("post_id")
            .in("post_id", postIds)
            .eq("action_type", "share");

          // Récupérer les profils des auteurs
          const authorIds = [
            ...new Set(topPosts.map((post) => post.author_id)),
          ];
          const { data: authorsData } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", authorIds);

          // Créer des maps pour compter les interactions
          const likesMap = new Map();
          const commentsMap = new Map();
          const sharesMap = new Map();
          const authorsMap = new Map();

          (likesData || []).forEach((like) => {
            likesMap.set(like.post_id, (likesMap.get(like.post_id) || 0) + 1);
          });

          (commentsData || []).forEach((comment) => {
            commentsMap.set(
              comment.post_id,
              (commentsMap.get(comment.post_id) || 0) + 1
            );
          });

          (sharesData || []).forEach((share) => {
            sharesMap.set(
              share.post_id,
              (sharesMap.get(share.post_id) || 0) + 1
            );
          });

          (authorsData || []).forEach((author) => {
            authorsMap.set(author.id, author.username);
          });

          // Grouper les posts par catégorie et trouver le plus liké pour chaque catégorie
          const postsByCategory: Record<string, any[]> = {
            guide: [],
            theory: [],
            rp: [],
            event: [],
          };

          topPosts.forEach((post: any) => {
            const likes = likesMap.get(post.id) || 0;
            const comments = commentsMap.get(post.id) || 0;
            const shares = sharesMap.get(post.id) || 0;
            const author = authorsMap.get(post.author_id) || "Utilisateur";

            const postWithStats = {
              ...post,
              likes,
              comments,
              shares,
              author,
            };

            console.log(
              `[Carrousel] Post ${post.id} (${post.type}): ${likes} likes, titre: "${post.title}"`
            );

            if (postsByCategory[post.type]) {
              postsByCategory[post.type].push(postWithStats);
            }
          });

          console.log("[Carrousel] Posts par catégorie:", postsByCategory);

          // Sélectionner le post le plus liké de chaque catégorie
          const topPostsByCategory: any[] = [];
          Object.entries(postsByCategory).forEach(([category, posts]) => {
            console.log(
              `[Carrousel] Catégorie ${category}: ${posts.length} posts`
            );
            if (posts.length > 0) {
              const topPost = posts.sort(
                (a: any, b: any) => b.likes - a.likes
              )[0];
              console.log(`[Carrousel] Top post pour ${category}:`, topPost);
              topPostsByCategory.push({
                category,
                post: topPost,
              });
            }
          });

          console.log(
            "[Carrousel] Top posts par catégorie:",
            topPostsByCategory
          );

          // Générer les items du carrousel
          const categoryConfig: Record<string, any> = {
            guide: {
              badge: "Guide",
              badgeColor: "bg-blue-500",
              iconName: "Users",
              color: "text-blue-500",
              subtitle: "Tutoriel communautaire",
            },
            theory: {
              badge: "Théorie",
              badgeColor: "bg-yellow-500",
              iconName: "Star",
              color: "text-yellow-500",
              subtitle: "Spéculation communautaire",
            },
            rp: {
              badge: "RP",
              badgeColor: "bg-green-500",
              iconName: "Heart",
              color: "text-green-500",
              subtitle: "Roleplay immersif",
            },
            event: {
              badge: "Événement",
              badgeColor: "bg-purple-500",
              iconName: "Trophy",
              color: "text-purple-500",
              subtitle: "Compétition communautaire",
            },
          };

          const carouselData = topPostsByCategory.map(
            (item: any, index: number) => {
              const config = categoryConfig[item.category];
              const post = item.post;

              return {
                id: index + 1,
                title:
                  post.title.length > 50
                    ? post.title.substring(0, 50) + "..."
                    : post.title,
                subtitle: config.subtitle,
                description:
                  post.content.length > 120
                    ? post.content.substring(0, 120) + "..."
                    : post.content,
                image: getImageForCategory(item.category),
                badge: config.badge,
                badgeColor: config.badgeColor,
                stats: {
                  likes: post.likes,
                  comments: post.comments,
                  shares: post.shares,
                },
                iconName: config.iconName,
                color: config.color,
                postId: post.id,
                author: post.author,
              };
            }
          );

          // Ajouter des items par défaut si on n'a pas assez de posts

          while (carouselData.length < 4) {
            const index = carouselData.length;
            const categories = ["guide", "theory", "rp", "event"];
            const category = categories[index];
            const config = categoryConfig[category];

            carouselData.push({
              id: index + 1,
              title: `${config.badge} Populaire`,
              subtitle: config.subtitle,
              description:
                "Aucun post disponible dans cette catégorie pour le moment. Soyez le premier à publier !",
              image: getImageForCategory(category),
              badge: config.badge,
              badgeColor: config.badgeColor,
              stats: {
                likes: 0,
                comments: 0,
                shares: 0,
              },
              iconName: config.iconName,
              color: config.color,
              postId: 0,
              author: "Communauté",
            });
          }

          console.log(
            "[Carrousel] Données finales du carrousel:",
            carouselData
          );
          setCarouselItems(carouselData);
          processedCarouselData = carouselData;

          // Sauvegarder les données en cache
          try {
            const dataToCache = {
              stats: {
                posts: postsCount ?? 0,
                members: membersCount ?? 0,
                loading: false,
              },
              popularTags: processedTags,
              carouselItems: processedCarouselData,
            };

            const cacheObject = {
              data: dataToCache,
              timestamp: Date.now(),
              version: CACHE_VERSION,
            };

            localStorage.setItem(
              "community_data_cache",
              JSON.stringify(cacheObject)
            );
            console.log("[Cache] Données sauvegardées en cache");
          } catch (cacheError) {
            console.warn("[Cache] Erreur lors de la sauvegarde:", cacheError);
          }
        } else {
          console.log("[Carrousel] Aucun post récupéré de la base de données");
        }
      } catch (error) {
        console.warn(
          "Erreur lors de la récupération des statistiques et tags:",
          error
        );
        setStats({
          posts: 150,
          members: 1200,
          loading: false,
        });
        setIsInitialLoad(false);
        setPopularTags([
          {
            name: "#modding",
            count: 45,
            color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          },
          {
            name: "#rp",
            count: 38,
            color: "bg-green-100 text-green-800 hover:bg-green-200",
          },
          {
            name: "#guide",
            count: 32,
            color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
          },
          {
            name: "#théorie",
            count: 28,
            color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
          },
          {
            name: "#événement",
            count: 25,
            color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
          },
          {
            name: "#racing",
            count: 22,
            color: "bg-red-100 text-red-800 hover:bg-red-200",
          },
          {
            name: "#mafia",
            count: 18,
            color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
          },
          {
            name: "#tutoriel",
            count: 15,
            color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
          },
        ]);

        // Données par défaut pour le carrousel en cas d'erreur
        setCarouselItems([
          {
            id: 1,
            title: "Tournoi Racing GTA 6",
            subtitle: "Compétition communautaire",
            description:
              "Participez au plus grand tournoi de course de la communauté GTA 6. Récompenses exclusives à gagner !",
            image: "/Evenement.jpg",
            badge: "Événement",
            badgeColor: "bg-purple-500",
            stats: { likes: 156, comments: 23, shares: 12 },
            iconName: "Trophy",
            color: "text-purple-500",
            postId: 0,
            author: "Communauté",
          },
          {
            id: 2,
            title: "Guide Modding Avancé",
            subtitle: "Tutoriel communautaire",
            description:
              "Apprenez à créer des mods professionnels pour GTA 6 avec notre guide étape par étape.",
            image: "/Femme.jpg",
            badge: "Guide",
            badgeColor: "bg-blue-500",
            stats: { likes: 89, comments: 34, shares: 8 },
            iconName: "Users",
            color: "text-blue-500",
            postId: 0,
            author: "ModMaster",
          },
          {
            id: 3,
            title: "Théorie : La Fin Secrète",
            subtitle: "Spéculation communautaire",
            description:
              "Découvrez les théories les plus folles sur la fin cachée de GTA 6. Que se cache-t-il vraiment ?",
            image: "/Conspiration.jpg",
            badge: "Théorie",
            badgeColor: "bg-yellow-500",
            stats: { likes: 67, comments: 45, shares: 15 },
            iconName: "Star",
            color: "text-yellow-500",
            postId: 0,
            author: "TheoryMaster",
          },
          {
            id: 4,
            title: "Scénario RP Mafia",
            subtitle: "Roleplay immersif",
            description:
              "Plongez dans l'univers de la mafia avec notre scénario RP complet. Devenez le parrain !",
            image: "/Soldat.jpg",
            badge: "RP",
            badgeColor: "bg-green-500",
            stats: { likes: 54, comments: 28, shares: 6 },
            iconName: "Heart",
            color: "text-green-500",
            postId: 0,
            author: "RPMaster",
          },
        ]);
      }
    }

    fetchStatsAndTags();
  }, []);

  // Event listener pour vider le cache avec Ctrl+Shift+R
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "R") {
        event.preventDefault();
        clearCache();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Fonction pour vider le cache manuellement (utile pour le développement)
  const clearCache = () => {
    localStorage.removeItem("community_data_cache");
    console.log("[Cache] Cache vidé manuellement");
    window.location.reload();
  };

  // Fonction pour résoudre les icônes dynamiquement
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return Users;
      case "Trophy":
        return Trophy;
      case "Star":
        return Star;
      case "Heart":
        return Heart;
      default:
        return Star;
    }
  };

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

  // Composant Sidebar réutilisable
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Outils rapides */}
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
            <Link href="/community/create">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                onClick={() => setIsSidebarOpen(false)}
              >
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
            </Link>
            <Link href="/profile?tab=posts">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsSidebarOpen(false)}
              >
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
            </Link>
            <Link href="/profile?tab=favorites">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsSidebarOpen(false)}
              >
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
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de la communauté */}
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Statistiques
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Posts créés</span>
              <span className="text-lg font-bold text-primary">
                {isInitialLoad ? "..." : stats.posts.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Membres actifs</span>
              <span className="text-lg font-bold text-green-500">
                {isInitialLoad ? "..." : stats.members.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags populaires */}
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
            {popularTags.map((tag, index) => (
              <Badge
                key={index}
                className={`${tag.color} cursor-pointer transition-colors flex items-center gap-1`}
                title={`${tag.count} post${tag.count > 1 ? "s" : ""}`}
              >
                {tag.name}
                <span className="text-xs opacity-70">({tag.count})</span>
              </Badge>
            ))}
            {popularTags.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Chargement des tags populaires...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liens externes et partenaires */}
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
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 opacity-60 cursor-not-allowed">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Twitter
                </span>
                <span className="text-xs text-muted-foreground">
                  Indisponible pour le moment
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 opacity-60 cursor-not-allowed">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Discord
                </span>
                <span className="text-xs text-muted-foreground">
                  Indisponible pour le moment
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 opacity-60 cursor-not-allowed">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  YouTube
                </span>
                <span className="text-xs text-muted-foreground">
                  Indisponible pour le moment
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 opacity-60 cursor-not-allowed">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c.13.013.26.026.39.04-.13.13-.26.26-.39.39-.013-.13-.026-.26-.04-.39-.13.013-.26.026-.39.04.13.13.26.26.39.39.013-.13.026-.26.04-.39zM12 2.4c2.4 0 4.8.8 6.4 2.4.8.8 1.2 1.6 1.6 2.4.4.8.4 1.6.4 2.4 0 .8 0 1.6-.4 2.4-.4.8-.8 1.6-1.6 2.4-1.6 1.6-4 2.4-6.4 2.4s-4.8-.8-6.4-2.4c-.8-.8-1.2-1.6-1.6-2.4-.4-.8-.4-1.6-.4-2.4 0-.8 0-1.6.4-2.4.4-.8.8-1.6 1.6-2.4C7.2 3.2 9.6 2.4 12 2.4z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Partenaires
                </span>
                <span className="text-xs text-muted-foreground">
                  Indisponible pour le moment
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ProtectedRoute>
      <AuthProvider>
        <div className="w-full pt-20">
          {/* Carrousel Hero */}
          <section className="w-full relative py-6 md:py-12">
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
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Contenu du carrousel */}
            <div className="relative z-10 max-w-6xl mx-auto px-4">
              {/* Titre et description */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
                  Communauté GTA 6
                </h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-lg px-4">
                  Découvrez, partagez et participez à la plus grande communauté
                  de moddeurs et joueurs GTA 6
                </p>
              </div>

              <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                  {carouselItems.map((item) => {
                    const Icon = getIconComponent(item.iconName);
                    return (
                      <CarouselItem
                        key={item.id}
                        className="basis-full sm:basis-1/2 lg:basis-1/3"
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
                                <span className="text-xs text-muted-foreground">
                                  Par {item.author}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {item.stats.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {item.stats.comments}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="w-3 h-3" />
                                  {item.stats.shares}
                                </div>
                              </div>
                            </div>

                            {item.postId > 0 ? (
                              <Link href={`/community/${item.postId}`}>
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                                  Voir plus
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 cursor-not-allowed"
                                disabled
                              >
                                Aucun post disponible
                              </Button>
                            )}
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
          <section className="w-full bg-background backdrop-blur-sm border-b border-border/50">
            <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
              <div className="flex flex-col gap-4 md:gap-6">
                {/* Barre de recherche */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={getSearchPlaceholder()}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/80 backdrop-blur-sm border-border focus:border-primary"
                  />
                </div>

                {/* Filtres par catégorie */}
                {isMounted && (
                  <>
                    {/* Mobile : Affichage en deux lignes */}
                    {isMobile ? (
                      <div className="space-y-3">
                        {/* Première ligne : Tous, Guide, Théorie */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {filterCategories.slice(0, 3).map((category) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            return (
                              <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium border transition-all whitespace-nowrap text-sm ${
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

                        {/* Deuxième ligne : RP, Event */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {filterCategories.slice(3).map((category) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            return (
                              <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium border transition-all whitespace-nowrap text-sm ${
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
                      </div>
                    ) : (
                      /* Desktop : Affichage en une seule ligne */
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {filterCategories.map((category) => {
                          const Icon = category.icon;
                          const isActive = selectedCategory === category.id;
                          return (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-all whitespace-nowrap text-base ${
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
                    )}
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Contenu principal */}
          <section className="w-full py-6 md:py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex gap-0 lg:gap-8">
                {/* Colonne principale - Publications dynamiques */}
                <div className="flex-1 min-w-0">
                  {/* Indicateur de filtres actifs */}
                  {(searchQuery.trim() || selectedCategory !== "all") && (
                    <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Filter className="w-4 h-4 text-primary" />
                        <span className="text-primary font-medium">
                          Filtres actifs :
                        </span>
                        {selectedCategory !== "all" && (
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                            {
                              filterCategories.find(
                                (cat) => cat.id === selectedCategory
                              )?.label
                            }
                          </span>
                        )}
                        {searchQuery.trim() && (
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                            "{searchQuery}"
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                          }}
                          className="ml-auto text-primary hover:text-primary/80 text-xs underline"
                        >
                          Effacer les filtres
                        </button>
                      </div>
                    </div>
                  )}

                  <CommunityFeed
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                  />
                </div>

                {/* Barre latérale - masquée sur mobile */}
                {isMounted && !isMobile && (
                  <div className="w-80 flex-shrink-0">
                    <div className="sticky top-24">
                      <SidebarContent />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Bouton flèche pour ouvrir la sidebar sur mobile */}
          {isMounted && isMobile && (
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-primary/90 hover:bg-primary shadow-xl border-0 rounded-full w-12 h-12"
                >
                  <svg
                    className="w-5 h-5 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle>Outils rapides</SheetTitle>
                </SheetHeader>
                <div className="p-6">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </AuthProvider>
    </ProtectedRoute>
  );
}
