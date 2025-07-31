"use client";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Upload,
  FileText,
  Lightbulb,
  Users,
  Calendar,
  Image as ImageIcon,
  Video,
  File,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { setupDatabase } from "@/lib/database-setup";

const POST_TYPES = [
  {
    id: "guide",
    label: "Guide",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: "Tutoriels, conseils et guides pratiques",
  },
  {
    id: "theory",
    label: "Théorie",
    icon: Lightbulb,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    description: "Analyses, spéculations et théories",
  },
  {
    id: "rp",
    label: "RP",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    description: "Scénarios de roleplay et histoires",
  },
  {
    id: "event",
    label: "Événement",
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    description: "Tournois, compétitions et événements",
  },
];

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  // Vérifier la configuration de la base de données au chargement
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Test de connexion Supabase
        console.log("Test de connexion Supabase...");
        const { data: testData, error: testError } = await supabase
          .from("community")
          .select("count")
          .limit(1);

        if (testError) {
          console.error("Erreur de connexion Supabase:", testError);
        } else {
          console.log("Connexion Supabase OK");
        }

        const result = await setupDatabase();
        console.log(
          "Résultat de la vérification de la base de données:",
          result
        );

        if (!result.allReady) {
          toast({
            title: "Configuration requise",
            description:
              "La base de données n'est pas configurée. Vérifiez la console pour plus de détails.",
            variant: "warning",
          });
        } else {
          setDbReady(true);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de la base de données:",
          error
        );
        toast({
          title: "Erreur de configuration",
          description:
            "Impossible de vérifier la configuration de la base de données.",
          variant: "destructive",
        });
      }
    };

    checkDatabase();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validation de la taille du fichier (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: `${selectedFile.name} dépasse la limite de 10MB.`,
        variant: "warning",
      });
      return;
    }

    // Validation de la durée pour les vidéos (10 minutes max)
    if (selectedFile.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const maxDuration = 10 * 60; // 10 minutes en secondes

        if (duration > maxDuration) {
          toast({
            title: "Vidéo trop longue",
            description: `${
              selectedFile.name
            } dépasse la limite de 10 minutes. Durée actuelle: ${Math.round(
              duration / 60
            )} minutes.`,
            variant: "warning",
          });
          return;
        }

        // Si la durée est OK, ajouter le fichier
        setFiles([selectedFile]);
        setPreviewImages([]);
        setVideoDuration(duration);

        toast({
          title: "Vidéo ajoutée",
          description: `${
            selectedFile.name
          } a été ajoutée avec succès. Durée: ${formatDuration(duration)}`,
          variant: "info",
        });
      };

      video.onerror = () => {
        toast({
          title: "Erreur de lecture vidéo",
          description:
            "Impossible de lire la durée de la vidéo. Vérifiez que le fichier est valide.",
          variant: "warning",
        });
      };

      video.src = URL.createObjectURL(selectedFile);
      return; // Sortir de la fonction, le fichier sera ajouté dans onloadedmetadata
    }

    // Pour les autres types de fichiers (images, documents)
    setFiles([selectedFile]);
    setPreviewImages([]);

    // Créer la preview pour les images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages([e.target?.result as string]);
      };
      reader.readAsDataURL(selectedFile);
    }

    toast({
      title: "Fichier ajouté",
      description: `${selectedFile.name} a été ajouté avec succès.`,
      variant: "info",
    });
  };

  const removeFile = () => {
    const fileName = files[0]?.name;
    setFiles([]);
    setPreviewImages([]);
    setVideoDuration(null);

    toast({
      title: "Fichier supprimé",
      description: `${fileName} a été supprimé.`,
      variant: "info",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !title.trim() || !content.trim()) return;

    // Vérifier que l'utilisateur est connecté
    if (!user) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour créer un post.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload du premier fichier seulement (compatible avec la structure existante)
      let fileUrl = "";
      if (files.length > 0) {
        const file = files[0]; // On ne prend que le premier fichier
        const fileName = `${user.id}/${Date.now()}_${file.name}`;

        console.log("Tentative d'upload du fichier:", fileName);
        console.log("Type de fichier:", file.type);
        console.log("Taille du fichier:", file.size);

        try {
          // Utiliser directement l'API Supabase côté client pour éviter les problèmes RLS
          const fileName = `${user.id}/${Date.now()}_${file.name}`;

          const { data, error } = await supabase.storage
            .from("community-uploads")
            .upload(fileName, file);

          if (error) {
            console.error("Erreur upload Supabase:", error);
            throw new Error(`Erreur upload: ${error.message}`);
          }

          if (data) {
            fileUrl = data.path;
            console.log("Fichier uploadé avec succès:", fileUrl);
          } else {
            throw new Error("Aucune donnée retournée par l'upload");
          }
        } catch (uploadError) {
          console.error("Exception lors de l'upload:", uploadError);
          throw uploadError;
        }
      }

      // Préparer les données du post
      const postData = {
        author_id: user.id,
        type: selectedType,
        title: title.trim(),
        content: content.trim(),
        file_url: fileUrl || null, // Utiliser null si pas de fichier
      };

      console.log("Tentative d'insertion du post:", postData);

      try {
        // Utiliser directement l'API Supabase côté client
        const { error: insertError } = await supabase
          .from("community")
          .insert(postData);

        if (insertError) {
          console.error("Erreur insertion post:", insertError);
          throw new Error(`Erreur insertion post: ${insertError.message}`);
        }

        console.log("Post créé avec succès");
      } catch (insertException) {
        console.error("Exception lors de l'insertion:", insertException);
        throw insertException;
      }

      // Notification de succès
      toast({
        title: "Post créé avec succès !",
        description: "Votre contenu a été publié dans la communauté.",
        variant: "success",
      });

      // Redirection vers la communauté
      setTimeout(() => {
        router.push("/community");
      }, 1500);
    } catch (error) {
      console.error("Erreur détaillée lors de la création du post:", error);
      console.error("Type d'erreur:", typeof error);
      console.error(
        "Stack trace:",
        error instanceof Error ? error.stack : "Pas de stack trace"
      );

      let errorMessage =
        "Une erreur est survenue lors de la publication de votre post.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
      }

      toast({
        title: "Erreur lors de la création",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTypePlaceholder = () => {
    switch (selectedType) {
      case "guide":
        return "Décrivez votre guide étape par étape, ajoutez des conseils pratiques, des captures d'écran...";
      case "theory":
        return "Expliquez votre théorie, partagez vos analyses, vos découvertes, vos spéculations...";
      case "rp":
        return "Décrivez votre scénario RP, les personnages, les règles, l'histoire...";
      case "event":
        return "Détaillez votre événement : date, lieu, programme, récompenses, modalités d'inscription...";
      default:
        return "Racontez votre histoire, partagez vos découvertes...";
    }
  };

  return (
    <ProtectedRoute>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-20">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/community">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">Créer un post</h1>
                <p className="text-muted-foreground">
                  Partagez votre contenu avec la communauté GTA 6
                </p>
              </div>
              <Link href="/community/create/diagnostic">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Diagnostic
                </Button>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sélection du type de post */}
              <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-5 h-5 text-primary" />
                    Type de contenu
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Choisissez le type de contenu que vous souhaitez partager
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {POST_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                            isSelected
                              ? `${type.borderColor} ${type.bgColor} shadow-lg scale-105`
                              : "border-border hover:border-primary/50 bg-card/50 hover:bg-card/80"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-lg ${
                                isSelected ? type.bgColor : "bg-muted"
                              }`}
                            >
                              <Icon className={`w-6 h-6 ${type.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">
                                {type.label}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Informations principales */}
              <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-5 h-5 text-primary" />
                    Informations du post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Titre */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Titre *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Donnez un titre accrocheur à votre post..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-12 text-base"
                      maxLength={100}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Le titre doit être clair et descriptif</span>
                      <span>{title.length}/100</span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-base font-medium">
                      Contenu *
                    </Label>
                    <Textarea
                      id="content"
                      placeholder={getTypePlaceholder()}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] text-base resize-none"
                      maxLength={2000}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Utilisez le formatage Markdown pour enrichir votre
                        contenu
                      </span>
                      <span>{content.length}/2000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Médias */}
              <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Médias (optionnel)
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Ajoutez des images, vidéos ou documents pour enrichir votre
                    post
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Zone de drop */}
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      Glissez votre fichier ici
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      ou cliquez pour sélectionner un fichier
                    </p>
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      Choisir un fichier
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Formats acceptés : Images, Vidéos (max 10 min), PDF,
                      Documents (max 10MB)
                    </p>
                  </div>

                  {/* Liste des fichiers */}
                  {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className="font-medium">Fichier sélectionné</h4>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                        {files[0].type.startsWith("image/") &&
                        previewImages[0] ? (
                          <Image
                            src={previewImages[0]}
                            alt="Preview"
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                            {files[0].type.startsWith("image/") ? (
                              <ImageIcon className="w-5 h-5 text-primary" />
                            ) : files[0].type.startsWith("video/") ? (
                              <Video className="w-5 h-5 text-primary" />
                            ) : (
                              <File className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {files[0].name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(files[0].size / 1024 / 1024).toFixed(2)} MB
                            {videoDuration && (
                              <span className="ml-2">
                                • {formatDuration(videoDuration)}
                              </span>
                            )}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guide d'utilisation */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    Guide d'utilisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-500">
                        📝 Types de contenu
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • <strong>Guide</strong> : Tutoriels et conseils
                          pratiques
                        </li>
                        <li>
                          • <strong>Théorie</strong> : Analyses et spéculations
                        </li>
                        <li>
                          • <strong>RP</strong> : Scénarios de roleplay
                        </li>
                        <li>
                          • <strong>Événement</strong> : Tournois et
                          compétitions
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-purple-500">
                        📎 Médias acceptés
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Images (JPG, PNG, GIF)</li>
                        <li>• Vidéos (MP4, WebM) - max 10 minutes</li>
                        <li>• Documents (PDF, DOC, TXT)</li>
                        <li>• Taille max : 10MB (1 fichier par post)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Boutons d'action */}
              <div className="flex gap-4 justify-end">
                <Link href="/community">
                  <Button variant="outline" size="lg">
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  size="lg"
                  disabled={
                    loading ||
                    !selectedType ||
                    !title.trim() ||
                    !content.trim() ||
                    !dbReady
                  }
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publication...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Publier le post
                    </div>
                  )}
                </Button>
              </div>

              {/* Boutons de test */}
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!selectedType || !title.trim() || !content.trim()) {
                      toast({
                        title: "Informations manquantes",
                        description:
                          "Veuillez remplir le type, le titre et le contenu.",
                        variant: "warning",
                      });
                      return;
                    }

                    setLoading(true);
                    try {
                      const postData = {
                        author_id: user?.id,
                        type: selectedType,
                        title: title.trim(),
                        content: content.trim(),
                        file_url: null,
                      };

                      console.log(
                        "Test - Tentative d'insertion du post:",
                        postData
                      );

                      const { error: insertError } = await supabase
                        .from("community")
                        .insert(postData);

                      if (insertError) {
                        throw new Error(
                          `Erreur insertion post: ${insertError.message}`
                        );
                      }

                      toast({
                        title: "Test réussi !",
                        description: "Post créé sans fichier.",
                        variant: "success",
                      });

                      setTimeout(() => {
                        router.push("/community");
                      }, 1500);
                    } catch (error) {
                      console.error("Erreur test:", error);
                      toast({
                        title: "Erreur test",
                        description:
                          error instanceof Error
                            ? error.message
                            : "Erreur inconnue",
                        variant: "destructive",
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading || !dbReady}
                  className="text-xs"
                >
                  Test sans fichier
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!selectedType || !title.trim() || !content.trim()) {
                      toast({
                        title: "Informations manquantes",
                        description:
                          "Veuillez remplir le type, le titre et le contenu.",
                        variant: "warning",
                      });
                      return;
                    }

                    if (files.length === 0) {
                      toast({
                        title: "Aucun fichier sélectionné",
                        description:
                          "Veuillez sélectionner un fichier pour tester l'upload.",
                        variant: "warning",
                      });
                      return;
                    }

                    setLoading(true);
                    try {
                      const file = files[0];
                      console.log("Test upload - Fichier:", file.name);
                      console.log("Type:", file.type);
                      console.log("Taille:", file.size);

                      // Utiliser directement l'API Supabase côté client
                      const fileName = `${user?.id}/${Date.now()}_${file.name}`;

                      const { data, error } = await supabase.storage
                        .from("community-uploads")
                        .upload(fileName, file);

                      if (error) {
                        throw new Error(`Erreur upload: ${error.message}`);
                      }

                      if (data) {
                        console.log("Upload test réussi:", data.path);
                        toast({
                          title: "Test upload réussi !",
                          description: `Fichier uploadé: ${data.path}`,
                          variant: "success",
                        });
                      } else {
                        throw new Error("Aucune donnée retournée par l'upload");
                      }
                    } catch (error) {
                      console.error("Erreur test upload:", error);
                      toast({
                        title: "Erreur test upload",
                        description:
                          error instanceof Error
                            ? error.message
                            : "Erreur inconnue",
                        variant: "destructive",
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading || !dbReady || files.length === 0}
                  className="text-xs"
                >
                  Test upload fichier
                </Button>
              </div>
            </form>
          </div>
        </div>
      </AuthProvider>
    </ProtectedRoute>
  );
}
