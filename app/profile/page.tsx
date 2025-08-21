"use client";
import { useEffect, useState, useRef } from "react";

import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Star,
  FileText,
  Settings,
} from "lucide-react";

type TabType = "posts" | "favorites" | "mods" | "stats";

export default function ProfilePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [profile, setProfile] = useState<any>(null);
  const [mods, setMods] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [favoritePosts, setFavoritePosts] = useState<any[]>([]);
  const [favoriteMods, setFavoriteMods] = useState<any[]>([]);
  const [totalDownloadsOnMyMods, setTotalDownloadsOnMyMods] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Vérifier le paramètre tab dans l'URL
    const tabParam = searchParams.get("tab") as TabType;
    if (
      tabParam &&
      ["posts", "favorites", "mods", "stats"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }

    // Charger toutes les données en parallèle pour améliorer les performances
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProfile(),
          fetchUserMods(),
          fetchUserComments(),
          fetchUserVotes(),
          fetchUserDownloads(),
          fetchTotalDownloadsOnMyMods(),
          fetchMyPosts(),
          fetchFavoritePosts(),
          fetchFavoriteMods(),
        ]);
      } catch (error) {
        console.error(
          "[Profile] Erreur lors du chargement des données:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [user, searchParams]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (!error) setProfile(data);
  }

  async function fetchUserMods() {
    console.log(
      "[Profile] Récupération des mods pour l'utilisateur:",
      user?.id
    );

    // Utiliser author_id au lieu de user_id pour la table mods
    const { data, error } = await supabase
      .from("mods")
      .select("*")
      .eq("author_id", user?.id);

    console.log("[Profile] Mods récupérés:", data);
    console.log("[Profile] Erreur mods:", error);
    console.log("[Profile] Nombre de mods:", data?.length || 0);

    setMods(data || []);
  }

  async function fetchFavoriteMods() {
    console.log(
      "[Profile] Recherche des mods favoris pour l'utilisateur:",
      user?.id
    );

    let favoriteModIds = [];

    // Essayer la table mod_favorites si elle existe
    const { data: modFavorites, error: modFavError } = await supabase
      .from("mod_favorites")
      .select("mod_id")
      .eq("user_id", user?.id);

    console.log("[Profile] Favoris dans table mod_favorites:", modFavorites);
    console.log("[Profile] Erreur mod_favorites:", modFavError);

    if (modFavorites && modFavorites.length > 0) {
      favoriteModIds = modFavorites.map((f) => f.mod_id);
      console.log(
        "[Profile] IDs de mods favoris depuis mod_favorites:",
        favoriteModIds
      );
    }

    // Si pas de favoris dans mod_favorites, considérer les mods avec des ratings élevés (4-5 étoiles)
    if (favoriteModIds.length === 0) {
      const { data: highRatings, error: ratingsError } = await supabase
        .from("mod_ratings")
        .select("mod_id, rating")
        .eq("user_id", user?.id)
        .gte("rating", 4);

      console.log("[Profile] Ratings élevés trouvés:", highRatings);
      console.log("[Profile] Erreur ratings:", ratingsError);

      if (highRatings && highRatings.length > 0) {
        favoriteModIds = highRatings.map((r) => r.mod_id);
        console.log(
          "[Profile] IDs de mods avec ratings élevés:",
          favoriteModIds
        );
      }
    }

    // Récupérer les mods correspondants
    if (favoriteModIds.length > 0) {
      const { data: mods, error: modsError } = await supabase
        .from("mods")
        .select("*")
        .in("id", favoriteModIds)
        .order("created_at", { ascending: false });

      console.log("[Profile] Mods favoris récupérés:", mods);
      console.log("[Profile] Erreur mods:", modsError);
      setFavoriteMods(mods || []);
    } else {
      console.log("[Profile] Aucun mod favori trouvé");
      setFavoriteMods([]);
    }
  }

  async function fetchUserComments() {
    console.log(
      "[Profile] Récupération des commentaires pour l'utilisateur:",
      user?.id
    );

    try {
      // Récupérer les commentaires sur les mods et posts en parallèle
      const [modCommentsResult, postCommentsResult] = await Promise.all([
        supabase.from("comments").select("*").eq("user_id", user?.id),
        supabase.from("community_comments").select("*").eq("user_id", user?.id),
      ]);

      const modComments = modCommentsResult.data || [];
      const postComments = postCommentsResult.data || [];

      console.log("[Profile] Commentaires sur mods:", modComments);
      console.log("[Profile] Commentaires sur posts:", postComments);

      // Combiner les deux types de commentaires
      const allComments = [...modComments, ...postComments];
      console.log("[Profile] Total commentaires:", allComments.length);
      setComments(allComments);
    } catch (error) {
      console.error(
        "[Profile] Erreur lors de la récupération des commentaires:",
        error
      );
      setComments([]);
    }
  }

  async function fetchUserVotes() {
    console.log(
      "[Profile] Récupération des votes pour l'utilisateur:",
      user?.id
    );

    try {
      // Récupérer les votes/ratings sur les mods et likes sur posts en parallèle
      const [modVotesResult, postLikesResult] = await Promise.all([
        supabase.from("mod_ratings").select("*").eq("user_id", user?.id),
        supabase
          .from("post")
          .select("*")
          .eq("user_id", user?.id)
          .eq("action_type", "like"),
      ]);

      const modVotes = modVotesResult.data || [];
      const postLikes = postLikesResult.data || [];

      console.log("[Profile] Votes sur mods:", modVotes);
      console.log("[Profile] Likes sur posts:", postLikes);

      // Combiner les votes et likes
      const allVotes = [...modVotes, ...postLikes];
      console.log("[Profile] Total votes/likes:", allVotes.length);
      setVotes(allVotes);
    } catch (error) {
      console.error(
        "[Profile] Erreur lors de la récupération des votes:",
        error
      );
      setVotes([]);
    }
  }

  async function fetchUserDownloads() {
    console.log(
      "[Profile] Récupération des téléchargements pour l'utilisateur:",
      user?.id
    );

    try {
      const { data, error } = await supabase
        .from("downloads")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error && error.code === "42P01") {
        console.log("[Profile] Table downloads n'existe pas encore");
        setDownloads([]);
        return;
      }

      console.log("[Profile] Téléchargements:", data);
      console.log("[Profile] Erreur téléchargements:", error);
      setDownloads(data || []);
    } catch (error) {
      console.log(
        "[Profile] Erreur lors de la récupération des téléchargements:",
        error
      );
      setDownloads([]);
    }
  }

  async function fetchTotalDownloadsOnMyMods() {
    console.log(
      "[Profile] Calcul des téléchargements totaux pour les mods de l'utilisateur:",
      user?.id
    );

    // Récupérer les mods de l'utilisateur avec author_id
    const { data: myMods, error: myModsError } = await supabase
      .from("mods")
      .select("id")
      .eq("author_id", user?.id);

    console.log("[Profile] Mods de l'utilisateur:", myMods);
    console.log("[Profile] Erreur mods utilisateur:", myModsError);

    if (!myMods || myMods.length === 0) {
      console.log("[Profile] Aucun mod trouvé pour l'utilisateur");
      setTotalDownloadsOnMyMods(0);
      return;
    }

    const modIds = myMods.map((m) => m.id);
    console.log("[Profile] IDs des mods:", modIds);

    if (!modIds.length) {
      setTotalDownloadsOnMyMods(0);
      return;
    }

    try {
      // Essayer de récupérer les téléchargements
      const { data: downloadsData, error: downloadsError } = await supabase
        .from("downloads")
        .select("id, mod_id")
        .in("mod_id", modIds);

      if (downloadsError && downloadsError.code === "42P01") {
        console.log("[Profile] Table downloads n'existe pas encore");
        setTotalDownloadsOnMyMods(0);
        return;
      }

      console.log("[Profile] Téléchargements des mods:", downloadsData);
      console.log("[Profile] Erreur téléchargements mods:", downloadsError);
      setTotalDownloadsOnMyMods(downloadsData ? downloadsData.length : 0);
    } catch (error) {
      console.log(
        "[Profile] Erreur lors du calcul des téléchargements:",
        error
      );
      setTotalDownloadsOnMyMods(0);
    }
  }

  async function fetchMyPosts() {
    const { data } = await supabase
      .from("community")
      .select("*")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });
    setMyPosts(data || []);
  }

  async function fetchFavoritePosts() {
    try {
      // Récupérer les IDs des posts favoris d'abord
      const { data: favoriteIds, error: favoriteError } = await supabase
        .from("post")
        .select("post_id")
        .eq("user_id", user.id)
        .eq("action_type", "favorite");

      if (favoriteError) {
        console.error(
          "[Profile] Erreur lors de la récupération des IDs favoris:",
          favoriteError
        );
        setFavoritePosts([]);
        return;
      }

      if (!favoriteIds || favoriteIds.length === 0) {
        setFavoritePosts([]);
        return;
      }

      // Extraire les IDs des posts
      const postIds = favoriteIds.map((fav) => fav.post_id);

      // Récupérer les posts complets depuis la table community
      const { data: posts, error: postsError } = await supabase
        .from("community")
        .select("*")
        .in("id", postIds)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error(
          "[Profile] Erreur lors de la récupération des posts favoris:",
          postsError
        );
        setFavoritePosts([]);
        return;
      }

      setFavoritePosts(posts || []);
    } catch (error) {
      console.error(
        "[Profile] Erreur lors de la récupération des posts favoris:",
        error
      );
      setFavoritePosts([]);
    }
  }

  const tabs = [
    {
      id: "posts" as TabType,
      label: "Mes Publications",
      icon: <FileText className="w-4 h-4" />,
      count: myPosts.length,
    },
    {
      id: "favorites" as TabType,
      label: "Posts Favoris",
      icon: <Heart className="w-4 h-4" />,
      count: favoritePosts.length,
    },
    {
      id: "mods" as TabType,
      label: "Mods Favoris",
      icon: <Star className="w-4 h-4" />,
      count: favoriteMods.length,
    },
    {
      id: "stats" as TabType,
      label: "Statistiques",
      icon: <Settings className="w-4 h-4" />,
      count: null,
    },
  ];

  const renderPosts = () => (
    <div className="space-y-4">
      {myPosts.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Aucune publication pour le moment
          </p>
          <Link
            href="/community/create"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Créer votre première publication
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="bg-background/80 rounded-lg p-4 border border-pink-500/30 hover:border-pink-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                    post.type === "guide"
                      ? "bg-blue-500/20 text-blue-400"
                      : post.type === "theory"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : post.type === "rp"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {post.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                {post.content}
              </p>
              <Link
                href={`/community/${post.id}`}
                className="text-primary hover:underline text-sm"
              >
                Voir la publication →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavoritePosts = () => (
    <div className="space-y-4">
      {favoritePosts.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Aucun post favori pour le moment
          </p>
          <Link
            href="/community"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Découvrir des publications
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoritePosts.map((post) => (
            <div
              key={post.id}
              className="bg-background/80 rounded-lg p-4 border border-pink-500/30 hover:border-pink-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                    post.type === "guide"
                      ? "bg-blue-500/20 text-blue-400"
                      : post.type === "theory"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : post.type === "rp"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {post.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                {post.content}
              </p>
              <Link
                href={`/community/${post.id}`}
                className="text-primary hover:underline text-sm"
              >
                Voir la publication →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavoriteMods = () => (
    <div className="space-y-4">
      {favoriteMods.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Aucun mod favori pour le moment
          </p>
          <Link
            href="/mods"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Découvrir des mods
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteMods.map((mod) => (
            <div
              key={mod.id}
              className="bg-background/80 rounded-lg p-4 border border-pink-500/30 hover:border-pink-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
                  {mod.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  v{mod.version}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {mod.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                {mod.description}
              </p>
              <Link
                href={`/mod/${mod.slug}`}
                className="text-primary hover:underline text-sm"
              >
                Voir le mod →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStats = () => {
    // Calculer la note moyenne uniquement sur les ratings de mods (pas les likes)
    const modRatings = votes.filter((vote) => vote.rating !== undefined);
    const averageRating =
      modRatings.length > 0
        ? (
            modRatings.reduce((acc, v) => acc + v.rating, 0) / modRatings.length
          ).toFixed(1)
        : "0.0";

    console.log("[Profile] Rendu des statistiques:");
    console.log("- Mods publiés:", mods.length);
    console.log("- Téléchargements totaux:", totalDownloadsOnMyMods);
    console.log("- Note moyenne:", averageRating);
    console.log("- Commentaires:", comments.length);
    console.log("- Votes totaux:", votes.length);
    console.log("- Mods favoris:", favoriteMods.length);
    console.log("- Mods ratings:", modRatings.length);

    return (
      <div className="space-y-8">
        {/* Statistiques personnelles */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-pink-400">
            Statistiques personnelles
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center bg-background/80 rounded-lg p-4 border border-pink-500/30">
              <span className="text-2xl font-bold text-pink-400">
                {mods.length}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Mods publiés
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-background/80 rounded-lg p-4 border border-pink-500/30">
              <span className="text-2xl font-bold text-blue-400">
                {totalDownloadsOnMyMods}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Téléchargements
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-background/80 rounded-lg p-4 border border-pink-500/30">
              <span className="text-2xl font-bold text-yellow-400">
                {averageRating}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Note moyenne
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-background/80 rounded-lg p-4 border border-pink-500/30">
              <span className="text-2xl font-bold text-green-400">
                {comments.length}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Commentaires
              </span>
            </div>
          </div>
        </div>

        {/* Mes mods */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-pink-400">
            Mes mods publiés
          </h3>
          {mods.length === 0 ? (
            <div className="text-muted-foreground">
              Aucun mod publié pour le moment
            </div>
          ) : (
            <div className="space-y-2">
              {mods.map((mod) => (
                <div
                  key={mod.id}
                  className="bg-background/80 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between border border-pink-500/30"
                >
                  <div>
                    <span className="font-semibold text-lg">{mod.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      v{mod.version}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {mod.category}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Link
                      href={`/mod/${mod.slug}`}
                      className="px-3 py-1 rounded bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 transition-colors"
                    >
                      Voir
                    </Link>
                    <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historique des téléchargements */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-pink-400">
            Historique des téléchargements
          </h3>
          {downloads.length === 0 ? (
            <div className="text-muted-foreground">
              Aucun téléchargement pour le moment
            </div>
          ) : (
            <div className="space-y-2">
              {downloads.slice(0, 5).map((dl) => (
                <div
                  key={dl.id}
                  className="bg-background/80 rounded-lg p-4 border border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div>
                    <span className="font-semibold">
                      {dl.file_name || dl.file_path || "?"}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Date(dl.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <Link
                    href={`/mod/${dl.mod_id}`}
                    className="px-3 py-1 rounded bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 transition-colors mt-2 md:mt-0"
                  >
                    Voir le mod
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen w-full">
        {/* Arrière-plan */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/gta6-profile.jpg"
            alt="GTA 6 Background"
            className="w-full h-full object-cover object-center fixed top-0 left-0 blur-sm opacity-80"
            style={{ minHeight: "100vh", minWidth: "100vw" }}
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        {/* Contenu profil */}
        <div className="pt-24 max-w-6xl mx-auto px-4">
          {/* Header profil */}
          <div className="relative h-64 rounded-2xl overflow-hidden mb-8 flex items-center bg-background">
            <div className="relative z-10 flex items-center gap-6 px-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 border-pink-500 bg-background overflow-hidden flex items-center justify-center shadow-lg">
                  <Image
                    src={profile?.avatar_url || "/placeholder-user.jpg"}
                    alt={profile?.username || user?.email || "Utilisateur"}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="mt-2 px-3 py-1 rounded bg-pink-600/80 text-white text-xs font-semibold">
                  Membre depuis{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("fr-FR")
                    : "?"}
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                  {profile?.username || user?.email || "Utilisateur"}
                </h1>
                <p className="text-muted-foreground text-base">
                  {profile?.description || "Aucune description"}
                </p>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 border-b border-pink-500/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-pink-500 text-white shadow-lg"
                      : "bg-background/50 text-muted-foreground hover:bg-background/80 hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-white/20" : "bg-pink-500/20"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="bg-background/50 rounded-lg p-6 border border-pink-500/30">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <span className="ml-3 text-lg text-muted-foreground">
                  Chargement en cours...
                </span>
              </div>
            ) : (
              <>
                {activeTab === "posts" && renderPosts()}
                {activeTab === "favorites" && renderFavoritePosts()}
                {activeTab === "mods" && renderFavoriteMods()}
                {activeTab === "stats" && renderStats()}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
