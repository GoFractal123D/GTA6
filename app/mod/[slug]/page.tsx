"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VoteSystem } from "@/components/vote-system";
import { CommentSection } from "@/components/comment-section";
import {
  Download,
  Eye,
  Calendar,
  User,
  Star,
  Shield,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { use } from "react";

export default function ModDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [mod, setMod] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Supprime le state 'downloads', on utilisera toujours mod.downloads
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number>(mod?.rating || 0);
  // Fetch la note de l'utilisateur et la moyenne
  useEffect(() => {
    // Résoudre la promesse params pour obtenir le slug
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  useEffect(() => {
    console.log("[DEBUG] useEffect slug:", slug);
    if (!mod?.id) return;
    fetchUserRating();
    fetchAvgRating();
    // eslint-disable-next-line
  }, [mod?.id, user]);

  async function fetchMod() {
    setLoading(true);
    console.log("[DEBUG] fetchMod called with slug:", slug);
    try {
      const { data, error } = await supabase
        .from("mods")
        .select("*")
        .eq("id", slug)
        .single();
      console.log("[DEBUG] fetchMod result:", { data, error });
      if (error || !data) {
        setError("Mod introuvable ou erreur de chargement.");
        setLoading(false);
        return;
      }
      setMod(data);
      setLoading(false);
    } catch (e) {
      setError("Erreur lors du chargement du mod.");
      setLoading(false);
    }
  }

  async function fetchUserRating() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("mod_ratings")
        .select("rating")
        .eq("mod_id", mod.id)
        .eq("user_id", user.id)
        .single();
      if (!error) setUserRating(data?.rating || null);
    } catch (e) {
      // Ignore l'erreur, ne bloque pas le rendu
    }
  }
  async function fetchAvgRating() {
    try {
      const { data, error } = await supabase
        .from("mod_ratings")
        .select("rating")
        .eq("mod_id", mod.id);
      if (!error && data && data.length > 0) {
        const avg =
          data.reduce((acc, r) => acc + (r.rating || 0), 0) / data.length;
        setAvgRating(avg);
      } else {
        setAvgRating(0);
      }
    } catch (e) {
      setAvgRating(0);
    }
  }
  async function handleRate(rating: number) {
    if (!user) return;
    setUserRating(rating);
    await supabase.from("mod_ratings").upsert(
      [
        {
          mod_id: mod.id,
          user_id: user.id,
          rating,
        },
      ],
      { onConflict: "mod_id,user_id" }
    );
    fetchAvgRating();
  }
  // Composant étoiles interactives
  function StarRating({
    value,
    onChange,
    disabled = false,
  }: {
    value: number;
    onChange: (v: number) => void;
    disabled?: boolean;
  }) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            className={
              star <= value
                ? "text-yellow-400 hover:scale-110 transition-transform"
                : "text-muted-foreground hover:text-yellow-400 hover:scale-110 transition-transform"
            }
            aria-label={`Donner ${star} étoile${star > 1 ? "s" : ""}`}
            disabled={disabled}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              className="w-6 h-6"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          </button>
        ))}
      </div>
    );
  }

  // Helper pour obtenir l'URL publique d'un fichier/image Supabase Storage
  function getPublicUrl(path: string, bucket: string) {
    if (!path) return "";
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  async function handleDownload(filePath: string) {
    if (downloadedFiles.includes(filePath)) {
      // Déclenche quand même le téléchargement
      const url = getPublicUrl(filePath, "mods-files");
      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    await supabase
      .from("mods")
      .update({ downloads: (mod.downloads || 0) + 1 })
      .eq("id", mod.id);
    setDownloadedFiles((prev) => [...prev, filePath]);
    // Refetch le mod pour mettre à jour le compteur
    fetchMod();
    // Déclenche le téléchargement
    const url = getPublicUrl(filePath, "mods-files");
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <div>Chargement...</div>;
  if (error)
    return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!mod)
    return (
      <div className="text-center text-muted-foreground py-12">
        Mod introuvable
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {mod.category && <Badge>{mod.category}</Badge>}
              {mod.version && <Badge variant="outline">v{mod.version}</Badge>}
            </div>
            <h1 className="text-3xl font-bold">{mod.title}</h1>
            {mod.description && (
              <p className="text-muted-foreground max-w-3xl">
                {mod.description}
              </p>
            )}
          </div>
        </div>

        {/* Author and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={mod.author_avatar || "/placeholder-user.jpg"}
                alt={mod.author_name || "Auteur"}
              />
              <AvatarFallback>{mod.author_name?.[0] || "A"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {mod.author_name || mod.author_id || "Auteur inconnu"}
                </span>
              </div>
              {mod.created_at && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Publié le{" "}
                    {new Date(mod.created_at).toISOString().split("T")[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {mod.tags && Array.isArray(mod.tags) && mod.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {mod.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {mod.images && Array.isArray(mod.images) && mod.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Images du mod</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mod.images.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={getPublicUrl(img, "mods-images")}
                    alt={mod.title + " image " + (idx + 1)}
                    className="w-full rounded-lg"
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="comments">Commentaires</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>À propos de ce mod</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{mod.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Instructions d'installation</CardTitle>
                  <CardDescription>
                    Ajoute ici les instructions d'installation si besoin.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Important
                        </p>
                        <p className="text-sm text-yellow-700">
                          Sauvegardez vos fichiers de jeu avant d'installer ce
                          mod.
                        </p>
                      </div>
                    </div>
                  </div>
                  <pre className="whitespace-pre-line text-sm bg-muted p-4 rounded-lg">
                    {mod.installation || "Aucune instruction fournie."}
                  </pre>
                </CardContent>
              </Card>
              {/* Changelog */}
              {mod.changelog && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Changelog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-line text-sm bg-muted p-4 rounded-lg">
                      {mod.changelog}
                    </pre>
                  </CardContent>
                </Card>
              )}
              {/* Prérequis système */}
              {mod.requirements && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Prérequis système</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-line text-sm bg-muted p-4 rounded-lg">
                      {mod.requirements}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="comments">
              <CommentSection itemId={mod.id as number} itemType="mod" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Download */}
          {mod.files && Array.isArray(mod.files) && mod.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Téléchargements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mod.files.map((file: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleDownload(file)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:text-white active:scale-110 transition-transform transition-colors"
                    style={{ marginBottom: 8 }}
                    type="button"
                    disabled={downloadedFiles.includes(file)}
                  >
                    <Download className="w-4 h-4" />
                    Télécharger le fichier {idx + 1}
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Téléchargements
                </span>
                <span className="text-sm font-medium">
                  {(mod.downloads ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Note moyenne
                </span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <StarRating
                    value={Math.round(avgRating)}
                    onChange={() => {}}
                    disabled
                  />
                  {avgRating ? avgRating.toFixed(1) : "0"}/5
                </span>
              </div>
              {user && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Ma note</span>
                  <StarRating value={userRating || 0} onChange={handleRate} />
                </div>
              )}
              {mod.created_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Créé le</span>
                  <span className="text-sm font-medium">
                    {new Date(mod.created_at).toISOString().split("T")[0]}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report */}
          <Card>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Signaler ce mod
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
