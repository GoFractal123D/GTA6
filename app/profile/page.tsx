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
  Edit,
  Save,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type TabType = "posts" | "favorites" | "mods" | "stats";

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [profile, setProfile] = useState<any>(null);
  const [mods, setMods] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [favoritePosts, setFavoritePosts] = useState<any[]>([]);
  const [favoriteMods, setFavoriteMods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour l'édition du profil
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    description: "",
    avatar_url: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    console.log("[Profile] Début du chargement pour l'utilisateur:", user.id);

    // Vérifier le paramètre tab dans l'URL
    const tabParam = searchParams.get("tab") as TabType;
    if (
      tabParam &&
      ["posts", "favorites", "mods", "stats"].includes(tabParam)
    ) {
      console.log("[Profile] Tab spécifique demandé:", tabParam);
      setActiveTab(tabParam);
    }

    // Charger toutes les données en parallèle pour améliorer les performances
    const loadAllData = async () => {
      setLoading(true);
      console.log("[Profile] Début des requêtes de données...");
      console.log("[Profile] ID utilisateur:", user.id);

      // Vérification préliminaire que Supabase fonctionne
      try {
        const { data: testData, error: testError } = await supabase
          .from("profiles")
          .select("id")
          .limit(1);
        console.log("[Profile] Test de connexion Supabase:", {
          testData,
          testError,
        });
      } catch (error) {
        console.error("[Profile] Erreur de connexion Supabase:", error);
      }

      // Timeout de sécurité pour éviter un loading infini
      const timeoutId = setTimeout(() => {
        console.warn("[Profile] Timeout: Chargement trop long, arrêt forcé");
        setLoading(false);
      }, 15000); // 15 secondes

      try {
        const promises = [
          fetchProfile().then(() =>
            console.log("[Profile] ✓ fetchProfile terminé")
          ),
          fetchUserMods().then(() =>
            console.log("[Profile] ✓ fetchUserMods terminé")
          ),
          fetchUserComments().then(() =>
            console.log("[Profile] ✓ fetchUserComments terminé")
          ),
          fetchUserVotes().then(() =>
            console.log("[Profile] ✓ fetchUserVotes terminé")
          ),
          fetchMyPosts().then(() =>
            console.log("[Profile] ✓ fetchMyPosts terminé")
          ),
          fetchFavoritePosts().then(() =>
            console.log("[Profile] ✓ fetchFavoritePosts terminé")
          ),
          fetchFavoriteMods().then(() =>
            console.log("[Profile] ✓ fetchFavoriteMods terminé")
          ),
        ];

        await Promise.all(promises);
        console.log("[Profile] Toutes les données chargées avec succès");
      } catch (error) {
        console.error(
          "[Profile] Erreur lors du chargement des données:",
          error
        );
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
        console.log("[Profile] Fin du chargement");
      }
    };

    loadAllData();
  }, [user, searchParams]);

  async function fetchProfile() {
    console.log("[Profile] Récupération du profil...");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("[Profile] Erreur récupération profil:", error);
    } else {
      console.log("[Profile] Profil récupéré:", data);
    }

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
      console.log("[Profile] Lancement des requêtes de commentaires...");
      const [modCommentsResult, postCommentsResult] = await Promise.all([
        supabase.from("comments").select("*").eq("user_id", user?.id),
        supabase.from("community_comments").select("*").eq("user_id", user?.id),
      ]);

      console.log("[Profile] Résultats bruts - comments:", modCommentsResult);
      console.log(
        "[Profile] Résultats bruts - community_comments:",
        postCommentsResult
      );

      const modComments = modCommentsResult.data || [];
      const postComments = postCommentsResult.data || [];

      console.log("[Profile] Commentaires sur mods:", modComments.length);
      console.log("[Profile] Commentaires sur posts:", postComments.length);

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

  async function fetchMyPosts() {
    console.log("[Profile] Récupération des publications...");
    const { data, error } = await supabase
      .from("community")
      .select("*")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Profile] Erreur récupération publications:", error);
    } else {
      console.log("[Profile] Publications récupérées:", data?.length || 0);
    }

    setMyPosts(data || []);
  }

  async function fetchFavoritePosts() {
    console.log("[Profile] Récupération des posts favoris...");
    try {
      // Récupérer les IDs des posts favoris d'abord
      const { data: favoriteIds, error: favoriteError } = await supabase
        .from("post")
        .select("post_id")
        .eq("user_id", user.id)
        .eq("action_type", "favorite");

      console.log("[Profile] IDs favoris récupérés:", favoriteIds?.length || 0);

      if (favoriteError) {
        console.error(
          "[Profile] Erreur lors de la récupération des IDs favoris:",
          favoriteError
        );
        setFavoritePosts([]);
        return;
      }

      if (!favoriteIds || favoriteIds.length === 0) {
        console.log("[Profile] Aucun post favori trouvé");
        setFavoritePosts([]);
        return;
      }

      // Extraire les IDs des posts
      const postIds = favoriteIds.map((fav) => fav.post_id);
      console.log("[Profile] Récupération des posts avec IDs:", postIds);

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

      console.log("[Profile] Posts favoris récupérés:", posts?.length || 0);
      setFavoritePosts(posts || []);
    } catch (error) {
      console.error(
        "[Profile] Erreur lors de la récupération des posts favoris:",
        error
      );
      setFavoritePosts([]);
    }
  }

  // Fonctions pour l'édition du profil
  const openEditDialog = () => {
    setEditForm({
      username: profile?.username || "",
      description: profile?.description || "",
      avatar_url: profile?.avatar_url || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    console.log("🖼️ Début upload avatar:", file.name, file.size, "bytes");

    try {
      // Vérifications de base
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (max 5MB)");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide");
        return;
      }

      // Créer un nom de fichier unique avec le dossier utilisateur
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      console.log("📁 Upload vers:", fileName);

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true, // Permet d'écraser si existe déjà
        });

      if (error) {
        console.error("❌ Erreur upload avatar:", error);
        alert(`Erreur d'upload: ${error.message}`);
        return;
      }

      console.log("✅ Upload réussi:", data);

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);

      console.log("🔗 URL publique:", urlData.publicUrl);

      setEditForm((prev) => ({
        ...prev,
        avatar_url: urlData.publicUrl,
      }));
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement:", error);
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    console.log("💾 Début mise à jour profil:", {
      username: editForm.username.trim(),
      description: editForm.description.trim(),
      avatar_url: editForm.avatar_url,
    });

    try {
      const profileData = {
        id: user.id,
        username: editForm.username.trim() || null,
        description: editForm.description.trim() || null,
        avatar_url: editForm.avatar_url || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert(profileData)
        .select(); // Ajouter select() pour récupérer les données mises à jour

      if (error) {
        console.error("❌ Erreur mise à jour profil:", error);
        alert(`Erreur de mise à jour: ${error.message}`);
        return;
      }

      console.log("✅ Profil mis à jour:", data);

      // Mettre à jour l'état local
      const updatedProfile = {
        username: editForm.username.trim() || profile?.username,
        description: editForm.description.trim() || profile?.description,
        avatar_url: editForm.avatar_url || profile?.avatar_url,
      };

      setProfile((prev: any) => ({
        ...prev,
        ...updatedProfile,
      }));

      // Mettre à jour le profil global dans AuthProvider
      updateUserProfile(updatedProfile);

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour:", error);
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

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
              className="bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50 hover:border-pink-500/50 transition-colors shadow-sm"
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
              className="bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50 hover:border-pink-500/50 transition-colors shadow-sm"
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
              className="bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50 hover:border-pink-500/50 transition-colors shadow-sm"
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50 shadow-sm">
              <span className="text-2xl font-bold text-pink-400">
                {mods.length}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Mods publiés
              </span>
            </div>

            <div className="flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50 shadow-sm">
              <span className="text-2xl font-bold text-yellow-400">
                {averageRating}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Note moyenne
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50 shadow-sm">
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
            className="w-full h-full object-cover object-center fixed top-0 left-0 blur-sm opacity-60 dark:opacity-80"
            style={{ minHeight: "100vh", minWidth: "100vw" }}
          />
          <div className="absolute inset-0 bg-white/85 dark:bg-black/80" />
        </div>

        {/* Contenu profil */}
        <div className="pt-28 pb-8 max-w-6xl mx-auto px-4">
          {/* Header profil */}
          <div className="relative h-64 rounded-2xl overflow-hidden mb-8 flex items-center bg-background/95 backdrop-blur-sm border border-border/50">
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
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                    {profile?.username || user?.email || "Utilisateur"}
                  </h1>
                  <Button
                    onClick={openEditDialog}
                    variant="outline"
                    size="sm"
                    className="bg-background/90 backdrop-blur-sm border-border/50 hover:bg-pink-500/10 hover:border-pink-500/50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                </div>
                <p className="text-muted-foreground text-base">
                  {profile?.description || "Aucune description"}
                </p>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 border-b border-border/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-pink-500 text-white shadow-lg"
                      : "bg-background/80 text-muted-foreground hover:bg-background/95 hover:text-foreground border border-border/30"
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
          <div className="bg-background/95 backdrop-blur-sm rounded-lg p-6 border border-border/50">
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

      {/* Dialog d'édition du profil */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Modifier mon profil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload d'avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full border-2 border-pink-500/30 overflow-hidden bg-background">
                <Image
                  src={editForm.avatar_url || "/placeholder-user.jpg"}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-pink-500/30 hover:bg-pink-500/10"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Changer l'avatar
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Pseudo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pseudo</label>
              <Input
                value={editForm.username}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                placeholder="Votre pseudo..."
                className="border-pink-500/30 focus:border-pink-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Décrivez-vous en quelques mots..."
                rows={3}
                className="border-pink-500/30 focus:border-pink-500"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsEditDialogOpen(false)}
                variant="outline"
                className="flex-1 border-pink-500/30 hover:bg-pink-500/10"
              >
                <X className="w-4 h-4 mr-1" />
                Annuler
              </Button>
              <Button
                onClick={updateProfile}
                disabled={isUpdating}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
