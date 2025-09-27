"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import DownloadButton from "@/components/DownloadButton";
import StarRatingClient from "@/components/StarRatingClient";
import ModDetailTabs from "@/components/ModDetailTabs";
import { useEffect, useState, use } from "react";

export const dynamic = "force-dynamic";

export default function ModDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrap params with React.use()
  const { slug } = use(params);

  const [mod, setMod] = useState<any>(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMod() {
      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);

        // Vérifier que slug est valide
        if (!slug || typeof slug !== "string") {
          throw new Error("Slug invalide");
        }

        console.log("Chargement du mod avec slug:", slug);

        const { data, error: modError } = await supabase
          .from("mods")
          .select("*")
          .eq("id", slug)
          .single();

        if (modError) {
          console.error("Erreur Supabase:", modError);
          throw new Error(`Erreur base de données: ${modError.message}`);
        }

        if (!data) {
          throw new Error("Mod introuvable");
        }

        if (!isMounted) return;

        console.log("Mod chargé:", data.title);
        setMod(data);

        // Récupérer le nombre de commentaires
        const { count, error: countError } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("mod_id", data.id);

        if (countError) {
          console.warn("Erreur lors du comptage des commentaires:", countError);
        }

        if (isMounted) {
          setCommentsCount(count || 0);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du mod:", err);

        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Erreur inconnue lors du chargement");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMod();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 sm:p-12 backdrop-blur-sm max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement du mod...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !mod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 sm:p-12 backdrop-blur-sm max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {error || "Mod introuvable"}
            </h1>
            <p className="text-gray-400 mb-6">
              Le mod que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/mods">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux mods
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Gestion d'erreur finale au cas où quelque chose se passe mal
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 lg:pb-32">
          {/* Bouton retour */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8 lg:mb-12">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
            >
              <Link href="/mods">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Retour aux mods</span>
                <span className="sm:hidden">Retour</span>
              </Link>
            </Button>
          </div>

          {/* Header responsive */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-8">
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {mod.category && (
                    <Badge className="bg-purple-600/20 text-purple-200 border-purple-400/30 hover:bg-purple-600/30">
                      {mod.category}
                    </Badge>
                  )}
                  {mod.version && (
                    <Badge
                      variant="outline"
                      className="border-gray-400/30 text-gray-300 hover:bg-gray-400/10"
                    >
                      v{mod.version}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {mod.title}
                </h1>
                {mod.description && (
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-none lg:max-w-3xl">
                    {mod.description}
                  </p>
                )}
              </div>
            </div>

            {/* Auteur et date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-gray-300">
                  {mod.author_name || mod.author_id || "Auteur inconnu"}
                </span>
              </span>
              {mod.created_at && (
                <span className="flex items-center gap-2">
                  <span className="hidden sm:inline">•</span>
                  <span>
                    Publié le{" "}
                    {new Date(mod.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </span>
              )}
            </div>

            {/* Tags */}
            {mod.tags && Array.isArray(mod.tags) && mod.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {mod.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-gray-400/30 text-gray-300 hover:bg-gray-400/10 text-xs sm:text-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Sidebar mobile-first (affiché en premier sur mobile) */}
            <div className="lg:order-2 space-y-4 sm:space-y-6">
              {/* Download */}
              {mod.files &&
                Array.isArray(mod.files) &&
                mod.files.length > 0 && (
                  <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg sm:text-xl">
                        Téléchargements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mod.files.map((file: string, idx: number) => (
                        <DownloadButton key={idx} file={file} idx={idx} />
                      ))}
                    </CardContent>
                  </Card>
                )}

              {/* Stats */}
              <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg sm:text-xl">
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Téléchargements
                    </span>
                    <span className="text-sm font-medium text-white">
                      {(mod.downloads ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Note moyenne</span>
                    <StarRatingClient
                      modId={mod.id}
                      initialAvg={mod.rating ?? 0}
                    />
                  </div>
                  {mod.created_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Créé le</span>
                      <span className="text-sm font-medium text-white">
                        {new Date(mod.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:order-1 lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Images */}
              {mod.images &&
                Array.isArray(mod.images) &&
                mod.images.length > 0 && (
                  <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg sm:text-xl">
                        Images du mod
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {mod.images.map((img: string, idx: number) => (
                        <div
                          key={idx}
                          className="group relative overflow-hidden rounded-lg bg-gray-800/30"
                        >
                          <img
                            src={`https://lxazszzgjjwwfifvkfue.supabase.co/storage/v1/object/public/mods-images/${img}`}
                            alt={mod.title + " image " + (idx + 1)}
                            className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

              {/* Tabs */}
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg backdrop-blur-sm">
                <ModDetailTabs mod={mod} initialCommentsCount={commentsCount} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (renderError) {
    console.error("Erreur lors du rendu de la page:", renderError);

    // Fallback en cas d'erreur de rendu
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 sm:p-12 backdrop-blur-sm max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-red-400 mb-4">
              Erreur de chargement
            </h1>
            <p className="text-gray-400 mb-6">
              Une erreur inattendue s'est produite lors du chargement de cette
              page.
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Veuillez réessayer plus tard ou contacter le support si le
              problème persiste.
            </p>
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/mods">Retour aux mods</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
