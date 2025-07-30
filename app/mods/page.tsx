"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, Download, MessageCircle, Flame, Clock } from "lucide-react";
import DownloadButton from "@/components/DownloadButton";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ModsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [mods, setMods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [featured, setFeatured] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Récupérer les catégories distinctes
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("mods").select("category");
      const cats = Array.from(
        new Set((data || []).map((m) => m.category).filter(Boolean))
      );
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  // Récupérer les mods en vedette (les plus téléchargés)
  useEffect(() => {
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
    }
    fetchFeatured();
  }, []);

  // Récupérer les mods filtrés/paginés
  useEffect(() => {
    fetchMods();
    // eslint-disable-next-line
  }, [search, category, sort, page]);

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
    }
    setLoading(false);
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
      <div className="pt-24 max-w-6xl mx-auto px-4">
      {/* Section Mods du moment */}
      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Flame className="text-pink-500" /> Mods du moment
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {featured.map((mod) => (
              <div
                key={mod.id}
                className="min-w-[320px] bg-background/80 rounded-xl shadow-lg p-4 flex flex-col relative hover:scale-105 transition-transform border border-pink-500/30 animate-fade-in"
              >
                {mod.image && (
                  <img
                    src={mod.image}
                    alt={mod.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <div className="flex gap-2 mb-2">
                  {getBadges(mod).map((b, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded text-xs text-white font-semibold ${b.color}`}
                    >
                      {b.label}
                    </span>
                  ))}
                  {mod.category && (
                    <span className="px-2 py-0.5 rounded bg-muted text-xs font-semibold text-muted-foreground">
                      {mod.category}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-1 line-clamp-1">
                  {mod.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                  {mod.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {mod.downloads || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {mod.rating ? mod.rating.toFixed(1) : "-"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {mod.comments_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {mod.created_at
                      ? new Date(mod.created_at).toLocaleDateString("fr-FR")
                      : ""}
                  </span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button
                    asChild
                    size="sm"
                    variant="default"
                    className="w-full"
                  >
                    <Link href={`/mod/${mod.id}`}>Voir le mod</Link>
                  </Button>
                  {mod.files && mod.files.length > 0 && (
                    <DownloadButton file={mod.files[0]} idx={0} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barre de filtres dynamiques */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder={t("mods.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-64"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded border px-3 py-2 bg-background text-foreground"
          >
            <option value="">Toutes catégories</option>
            {/* Catégories fixes pertinentes */}
            <option value="véhicules">Véhicules</option>
            <option value="armes">Armes</option>
            <option value="tenues">Tenues</option>
            <option value="cartes">Cartes</option>
            <option value="gameplay">Gameplay</option>
            <option value="graphismes">Graphismes</option>
            <option value="missions">Missions</option>
            <option value="sons">Sons</option>
            <option value="outils">Outils</option>
            <option value="ui">UI</option>
            {/* Catégories dynamiques */}
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="rounded border px-3 py-2 bg-background text-foreground"
          >
            <option value="date">Plus récents</option>
            <option value="downloads">Populaires</option>
            <option value="rating">Mieux notés</option>
          </select>
        </div>
        <Button asChild>
          <Link href="/submit-mod">{t("mods.publish")}</Link>
        </Button>
      </div>

      {/* Grille de mods */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {skeletons.map((_, i) => (
            <div
              key={i}
              className="bg-background/60 rounded-xl shadow-lg p-6 h-64 animate-pulse"
            />
          ))}
        </div>
      )}
      {!loading && mods.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t("mods.noModsFound")}
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {mods.map((mod) => (
          <div
            key={mod.id}
            className="bg-background/80 rounded-xl shadow-lg p-4 flex flex-col relative border border-pink-500/30 hover:scale-105 hover:shadow-2xl transition-transform animate-fade-in group"
          >
            {mod.image && (
              <img
                src={mod.image}
                alt={mod.title}
                className="w-full h-40 object-cover rounded mb-2 group-hover:scale-105 transition-transform"
              />
            )}
            <div className="flex gap-2 mb-2">
              {getBadges(mod).map((b, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-xs text-white font-semibold ${b.color}`}
                >
                  {b.label}
                </span>
              ))}
              {mod.category && (
                <span className="px-2 py-0.5 rounded bg-muted text-xs font-semibold text-muted-foreground">
                  {mod.category}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold mb-1 line-clamp-1">{mod.title}</h3>
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
              {mod.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {mod.downloads || 0}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {mod.rating ? mod.rating.toFixed(1) : "-"}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {mod.comments_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {mod.created_at
                  ? new Date(mod.created_at).toLocaleDateString("fr-FR")
                  : ""}
              </span>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button asChild size="sm" variant="default" className="w-full">
                <Link href={`/mod/${mod.id}`}>Voir le mod</Link>
              </Button>
              {mod.files && mod.files.length > 0 && (
                <DownloadButton file={mod.files[0]} idx={0} />
              )}
            </div>
          </div>
        ))}
      </div>
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => setPage((p) => p + 1)} variant="outline">
            Charger plus
          </Button>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
