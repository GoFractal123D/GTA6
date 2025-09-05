"use client";
import { useEffect, useState, useRef } from "react";
import "./animations.css";

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Download,
  MessageCircle,
  Flame,
  Clock,
  Search,
  Filter,
  TrendingUp,
  Zap,
  Calendar,
  Award,
  Eye,
  Users,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import DownloadButton from "@/components/DownloadButton";
import ProtectedRoute from "@/components/ProtectedRoute";

// Cache global pour les données
const modsCache = {
  data: null as any,
  timestamp: 0,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  hasBeenInitialized: false,
};

// Fonction globale pour vérifier si le cache est valide
const isCacheValid = () => {
  return (
    modsCache.data &&
    Date.now() - modsCache.timestamp < modsCache.CACHE_DURATION
  );
};

export default function ModsPage() {
  const [search, setSearch] = useState("");
  const [mods, setMods] = useState<any[]>(
    modsCache.data?.mods && isCacheValid() ? modsCache.data.mods : []
  );
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    modsCache.data?.hasMore && isCacheValid() ? modsCache.data.hasMore : true
  );
  const [featured, setFeatured] = useState<any[]>(
    modsCache.data?.featured && isCacheValid() ? modsCache.data.featured : []
  );
  const [categories, setCategories] = useState<string[]>(
    modsCache.data?.categories && isCacheValid()
      ? modsCache.data.categories
      : []
  );
  const [initialLoadDone, setInitialLoadDone] = useState(
    modsCache.hasBeenInitialized
  );
  const isMountedRef = useRef(true);

  // Fonctions pour charger les données
  async function fetchCategories() {
    const { data } = await supabase.from("mods").select("category");
    const cats = Array.from(
      new Set((data || []).map((m) => m.category).filter(Boolean))
    );
    setCategories(cats);
    return cats;
  }

  async function fetchFeatured() {
    const { data } = await supabase
      .from("mods")
      .select("*")
      .order("downloads", { ascending: false })
      .limit(5);

    // Calculer le nombre de commentaires pour chaque mod en vedette
    const featuredWithComments = await Promise.all(
      (data || []).map(async (mod) => {
        const { count } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("mod_id", mod.id);
        return {
          ...mod,
          comments_count: count || 0,
        };
      })
    );

    setFeatured(featuredWithComments || []);
    return featuredWithComments;
  }

  // Chargement initial avec cache
  useEffect(() => {
    async function loadInitialData() {
      if (!initialLoadDone) {
        console.log(
          "[DEBUG] Chargement initial, cache valide:",
          isCacheValid()
        );
        console.log("[DEBUG] Données cache:", modsCache.data);

        if (
          isCacheValid() &&
          !search &&
          !category &&
          sort === "date" &&
          page === 1
        ) {
          // Utiliser les données du cache
          console.log("[DEBUG] Utilisation du cache");
          const cachedMods = modsCache.data.mods || [];
          const cachedFeatured = modsCache.data.featured || [];
          const cachedCategories = modsCache.data.categories || [];

          setMods(cachedMods);
          setFeatured(cachedFeatured);
          setCategories(cachedCategories);
          setHasMore(modsCache.data.hasMore || true);
          setInitialLoadDone(true);
          modsCache.hasBeenInitialized = true;

          console.log("[DEBUG] Cache appliqué - mods:", cachedMods.length);
          console.log(
            "[DEBUG] Cache appliqué - featured:",
            cachedFeatured.length
          );
        } else {
          // Charger toutes les données fraîches en parallèle
          console.log("[DEBUG] Chargement données fraîches");
          try {
            const [categoriesData, featuredData] = await Promise.all([
              fetchCategories(),
              fetchFeatured(),
            ]);

            console.log("[DEBUG] Featured data loaded:", featuredData?.length);

            // Charger les mods avec les données fraîches
            await fetchMods();
          } catch (error) {
            console.error("Erreur lors du chargement initial:", error);
            setLoading(false);
            setInitialLoadDone(true);
          }
        }
      }
    }

    loadInitialData();
    // eslint-disable-next-line
  }, []);

  // Récupérer les mods filtrés/paginés (seulement si pas de cache ou filtres actifs)
  useEffect(() => {
    if (initialLoadDone) {
      fetchMods();
    }
    // eslint-disable-next-line
  }, [search, category, sort, page, initialLoadDone]);

  async function fetchMods() {
    setLoading(true);
    let query = supabase.from("mods").select("*");
    if (search) query = query.ilike("title", `%${search}%`);
    if (category) query = query.eq("category", category);
    // Tri
    if (sort === "date")
      query = query.order("created_at", { ascending: false });
    if (sort === "downloads")
      query = query.order("downloads", { ascending: false });
    if (sort === "rating") query = query.order("rating", { ascending: false });
    // Pagination
    const pageSize = 9;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    const { data, error } = await query;
    if (!error) {
      // Calculer le nombre de commentaires pour chaque mod
      const modsWithComments = await Promise.all(
        (data || []).map(async (mod) => {
          const { count } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("mod_id", mod.id);
          return {
            ...mod,
            comments_count: count || 0,
          };
        })
      );

      if (page === 1) setMods(modsWithComments || []);
      else setMods((prev) => [...prev, ...(modsWithComments || [])]);
      setHasMore((data || []).length === pageSize);

      // Mettre en cache si c'est le chargement initial par défaut
      if (
        !search &&
        !category &&
        sort === "date" &&
        page === 1 &&
        !initialLoadDone
      ) {
        // Utiliser les données actuelles des states
        modsCache.data = {
          mods: modsWithComments,
          featured: featured, // Utiliser l'état featured actuel
          categories: categories, // Utiliser l'état categories actuel
          hasMore: (data || []).length === pageSize,
        };
        modsCache.timestamp = Date.now();
        console.log(
          "[DEBUG] Données mises en cache - featured:",
          featured.length
        );
      }
    }
    setLoading(false);
    setInitialLoadDone(true);
    modsCache.hasBeenInitialized = true;
  }

  // Skeleton loader
  const skeletons = Array.from({ length: 9 });

  // Helpers pour badges
  function getBadges(mod: any) {
    const badges = [];
    if (
      mod.created_at &&
      Date.now() - new Date(mod.created_at).getTime() < 1000 * 60 * 60 * 24 * 7
    )
      badges.push({ label: "Nouveau", color: "bg-blue-500" });
    if (mod.downloads > 100)
      badges.push({ label: "Populaire", color: "bg-pink-500" });
    if (mod.updated_at && mod.updated_at !== mod.created_at)
      badges.push({ label: "Mis à jour", color: "bg-purple-500" });
    return badges;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 px-4 overflow-hidden">
          {/* Image de fond avec overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-[url('/HeroMod.jpg')] bg-cover bg-center"
              style={{
                filter: "brightness(0.3) blur(1px)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-blue-900/60 to-purple-900/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          </div>

          {/* Particules animées */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40" />
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-50" />
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-30" />
          </div>

          <div className="container mx-auto relative z-10 text-center">
            {/* Badge de bienvenue */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 backdrop-blur-sm mb-6">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-100">
                Découvrez l'univers des mods GTA 6
              </span>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Mods Epic
            </h1>

            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transformez votre expérience GTA 6 avec les mods les plus
              populaires et innovants de la communauté
            </p>

            {/* Stats rapides */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {mods.length}+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Mods disponibles
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  50K+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Téléchargements
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  1.2K+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Créateurs
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Link href="#featured">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Explorer les mods
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-purple-400/50 text-white hover:bg-purple-500/20 font-semibold px-8 py-3 rounded-full backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <Link href="/submit-mod">
                  <Zap className="w-5 h-5 mr-2" />
                  Publier un mod
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Mods du moment */}
          {(() => {
            console.log("[DEBUG] Featured mods length:", featured.length);
            return featured.length > 0;
          })() && (
            <section id="featured" className="mb-16">
              {/* Header de section */}
              <div className="text-center mb-12">
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 backdrop-blur-sm mb-4">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-100">
                    Tendances actuelles
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Mods du Moment
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Découvrez les mods les plus téléchargés et appréciés par la
                  communauté
                </p>
              </div>

              {/* Grille de mods featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featured.slice(0, 6).map((mod, index) => (
                  <div
                    key={mod.id}
                    className="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    {/* Badge de ranking */}
                    {index < 3 && (
                      <div className="absolute top-4 left-4 z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                              : index === 1
                              ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
                              : "bg-gradient-to-r from-orange-600 to-orange-800 text-white"
                          } shadow-lg`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    )}

                    {/* Image avec overlay au hover */}
                    <div className="relative h-48 overflow-hidden">
                      {mod.image ? (
                        <Image
                          src={mod.image}
                          alt={mod.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                          <Gamepad2 className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {getBadges(mod)
                          .slice(0, 2)
                          .map((badge, i) => (
                            <Badge
                              key={i}
                              className={`${badge.color} text-white font-semibold shadow-lg`}
                            >
                              {badge.label}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-6">
                      {/* Titre et catégorie */}
                      <div className="mb-3">
                        {mod.category && (
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {mod.category}
                          </Badge>
                        )}
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {mod.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Download className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 font-medium">
                            {mod.downloads || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300 font-medium">
                            {mod.rating ? mod.rating.toFixed(1) : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300 font-medium">
                            {mod.comments_count || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300 font-medium">
                            {Math.floor(Math.random() * 1000) + 100}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          asChild
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Link href={`/mod/${mod.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Link>
                        </Button>
                        {mod.files && mod.files.length > 0 && (
                          <DownloadButton file={mod.files[0]} idx={0} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section Filtres et Recherche */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Explorer les Mods
                  </h3>
                  <p className="text-gray-400">
                    Trouvez le mod parfait pour votre expérience GTA 6
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/submit-mod">
                    <Zap className="w-5 h-5 mr-2" />
                    Publier un mod
                  </Link>
                </Button>
              </div>

              {/* Barre de recherche */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, description, catégorie..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-12 pr-4 py-4 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 rounded-xl focus:border-purple-500/50 focus:ring-purple-500/20 text-lg"
                />
              </div>

              {/* Filtres en tabs */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Catégories */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Catégorie
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-purple-500/50 focus:ring-purple-500/20 appearance-none cursor-pointer"
                    >
                      <option value="">🌟 Toutes catégories</option>
                      <option value="véhicules">🚗 Véhicules</option>
                      <option value="armes">🔫 Armes</option>
                      <option value="tenues">👕 Tenues</option>
                      <option value="cartes">🗺️ Cartes</option>
                      <option value="gameplay">🎮 Gameplay</option>
                      <option value="graphismes">🎨 Graphismes</option>
                      <option value="missions">📋 Missions</option>
                      <option value="sons">🔊 Sons</option>
                      <option value="outils">🔧 Outils</option>
                      <option value="ui">💻 Interface</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tri */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Trier par
                  </label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-purple-500/50 focus:ring-purple-500/20 appearance-none cursor-pointer"
                    >
                      <option value="date">📅 Plus récents</option>
                      <option value="downloads">🔥 Plus populaires</option>
                      <option value="rating">⭐ Mieux notés</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stats rapides des résultats */}
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    {mods.length} mods trouvés
                  </span>
                  {search && (
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Recherche: "{search}"
                    </span>
                  )}
                  {category && (
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Catégorie: {category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Grille de mods principale */}
          <section>
            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {skeletons.map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-gray-900/60 via-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 h-80 animate-pulse"
                  >
                    <div className="w-full h-40 bg-gray-700/50 rounded-xl mb-4" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                      <div className="h-3 bg-gray-700/50 rounded w-full" />
                      <div className="h-3 bg-gray-700/50 rounded w-2/3" />
                      <div className="flex gap-2 mt-4">
                        <div className="h-8 bg-gray-700/50 rounded flex-1" />
                        <div className="h-8 bg-gray-700/50 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message vide */}
            {!loading && mods.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-12 max-w-md mx-auto">
                  <Gamepad2 className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Aucun mod trouvé
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Aucun mod ne correspond à vos critères de recherche.
                  </p>
                  <Button
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                      setPage(1);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            )}

            {/* Grille de mods */}
            {!loading && mods.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
                  {mods.map((mod, index) => (
                    <div
                      key={mod.id}
                      className="mb-10 roup relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: "fadeInUp 0.6s ease-out forwards",
                      }}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {mod.image ? (
                          <Image
                            src={mod.image}
                            alt={mod.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700/30 to-gray-800/30 flex items-center justify-center">
                            <Gamepad2 className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Badges sur l'image */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {getBadges(mod)
                            .slice(0, 2)
                            .map((badge, i) => (
                              <Badge
                                key={i}
                                className={`${badge.color} text-white font-semibold text-xs shadow-lg backdrop-blur-sm`}
                              >
                                {badge.label}
                              </Badge>
                            ))}
                        </div>

                        {/* Icône favori/premium */}
                        <div className="absolute top-3 right-3">
                          {mod.rating && mod.rating >= 4.5 && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                              <Award className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-6">
                        {/* Titre et catégorie */}
                        <div className="mb-3">
                          {mod.category && (
                            <Badge variant="secondary" className="mb-2 text-xs">
                              {mod.category}
                            </Badge>
                          )}
                          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                            {mod.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {mod.description}
                        </p>

                        {/* Stats en grille */}
                        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 font-medium">
                              {mod.downloads || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-300 font-medium">
                              {mod.rating ? mod.rating.toFixed(1) : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300 font-medium">
                              {mod.comments_count || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300 font-medium text-xs">
                              {mod.created_at
                                ? new Date(mod.created_at).toLocaleDateString(
                                    "fr-FR",
                                    {
                                      day: "numeric",
                                      month: "short",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button
                            asChild
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Link href={`/mod/${mod.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </Link>
                          </Button>
                          {mod.files && mod.files.length > 0 && (
                            <DownloadButton file={mod.files[0]} idx={0} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bouton Charger plus */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={loading}
                      className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Charger plus de mods
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
