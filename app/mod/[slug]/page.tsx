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
import { Download, User, Star, AlertTriangle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import NextDynamic from "next/dynamic";

// Import dynamique du composant client pour les commentaires
const CommentSection = NextDynamic(
  () => import("@/components/CommentSection"),
  { ssr: false }
);

export const dynamic = "force-dynamic";

async function getMod(slug: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from("mods")
    .select("*")
    .eq("id", slug)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function ModDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const mod = await getMod(params.slug);
  if (!mod) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Mod introuvable
      </div>
    );
  }

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

        {/* Auteur et date */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {mod.author_name || mod.author_id || "Auteur inconnu"}
          </span>
          {mod.created_at && (
            <span className="flex items-center gap-1">
              Publié le {new Date(mod.created_at).toISOString().split("T")[0]}
            </span>
          )}
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
                    src={`${process.env.SUPABASE_URL}/storage/v1/object/public/mods-images/${img}`}
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
              <CommentSection modId={mod.id} />
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
                  <Button
                    key={idx}
                    onClick={() => {
                      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/mods-files/${file}`;
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:text-white active:scale-110 transition-transform transition-colors"
                    style={{ marginBottom: 8 }}
                    type="button"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger le fichier {idx + 1}
                  </Button>
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
                  <Star className="w-4 h-4 text-yellow-400" />
                  {mod.rating ? mod.rating.toFixed(1) : "0.0"}/5
                </span>
              </div>
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
        </div>
      </div>
    </div>
  );
}
