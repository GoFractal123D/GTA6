"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Video, Lightbulb, Link } from "lucide-react";

const TYPES = [
  { value: "guide", label: "Guide", icon: FileText, color: "text-blue-500" },
  { value: "video", label: "Vidéo", icon: Video, color: "text-red-500" },
  {
    value: "theory",
    label: "Théorie",
    icon: Lightbulb,
    color: "text-yellow-500",
  },
];

export default function CommunityForm() {
  const { user } = useAuth();
  const [type, setType] = useState("guide");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    let fileUrl = "";
    if (file) {
      const { data, error: uploadError } = await supabase.storage
        .from("community-uploads")
        .upload(`${user.id}/${Date.now()}_${file.name}`, file);
      if (uploadError) {
        setError("Erreur upload fichier");
        setLoading(false);
        return;
      }
      fileUrl = data?.path || "";
    }

    // Pour les vidéos, utiliser l'URL au lieu du fichier uploadé
    const finalFileUrl = type === "video" && videoUrl ? videoUrl : fileUrl;

    const { error: insertError } = await supabase.from("community").insert({
      author_id: user.id,
      type,
      title,
      content,
      file_url: finalFileUrl,
    });

    if (insertError) setError(insertError.message);
    else {
      setTitle("");
      setContent("");
      setFile(null);
      setVideoUrl("");
      setSuccess("Contenu publié !");
    }
    setLoading(false);
  };

  const getPlaceholder = () => {
    switch (type) {
      case "guide":
        return "Étapes détaillées, instructions, conseils pratiques...";
      case "video":
        return "Description de la vidéo, contexte, points clés...";
      case "theory":
        return "Hypothèses, analyses, spéculations, théories...";
      default:
        return "Contenu, description, lien vidéo, etc.";
    }
  };

  const getTitlePlaceholder = () => {
    switch (type) {
      case "guide":
        return "Titre du guide (ex: Comment installer les mods GTA 6)";
      case "video":
        return "Titre de la vidéo (ex: Gameplay GTA 6 - Première mission)";
      case "theory":
        return "Titre de la théorie (ex: Théorie sur la fin de GTA 6)";
      default:
        return "Titre du contenu";
    }
  };

  if (!user)
    return (
      <div className="text-center text-muted-foreground">
        Connecte-toi pour publier du contenu.
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card/80 shadow-smooth rounded-xl p-6 flex flex-col gap-6 animate-fade-in"
    >
      {/* Onglets */}
      <div className="flex gap-2">
        {TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-all ${
                type === t.value
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={() => setType(t.value)}
            >
              <Icon className={`w-4 h-4 ${t.color}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Titre */}
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          placeholder={getTitlePlaceholder()}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Contenu */}
      <div className="space-y-2">
        <Label htmlFor="content">Description</Label>
        <Textarea
          id="content"
          placeholder={getPlaceholder()}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px]"
          required
        />
      </div>

      {/* Section spécifique au type */}
      {type === "guide" && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <Label className="font-medium">
                Fichier du guide (optionnel)
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Ajoutez un fichier PDF, image ou document pour compléter votre
              guide.
            </p>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.txt,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </CardContent>
        </Card>
      )}

      {type === "video" && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" />
              <Label className="font-medium">Lien de la vidéo</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Collez le lien YouTube, Twitch ou autre plateforme vidéo.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setVideoUrl("")}
              >
                <Link className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {type === "theory" && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <Label className="font-medium">Support visuel (optionnel)</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Ajoutez des images, schémas ou captures d'écran pour illustrer
              votre théorie.
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </CardContent>
        </Card>
      )}

      {/* Bouton de publication */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-smooth hover:opacity-90 transition-all"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 animate-spin" />
            Publication...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Publier
          </div>
        )}
      </Button>

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-sm bg-green-500/10 p-3 rounded-lg">
          {success}
        </div>
      )}
    </form>
  );
}
