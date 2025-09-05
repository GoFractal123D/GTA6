import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import DownloadButton from "@/components/DownloadButton";
import StarRatingClient from "@/components/StarRatingClient";
import ModDetailTabs from "@/components/ModDetailTabs";

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

  // Récupérer le nombre de commentaires pour ce mod
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("mod_id", mod.id);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 space-y-8 pt-24 pb-8">
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
            {mod.images &&
              Array.isArray(mod.images) &&
              mod.images.length > 0 && (
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
            <ModDetailTabs
              mod={mod}
              initialCommentsCount={commentsCount || 0}
            />
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
                    <DownloadButton key={idx} file={file} idx={idx} />
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
                  <StarRatingClient
                    modId={mod.id}
                    initialAvg={mod.rating ?? 0}
                  />
                </div>
                {mod.created_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Créé le
                    </span>
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
    </div>
  );
}
