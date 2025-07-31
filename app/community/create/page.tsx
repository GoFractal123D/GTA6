"use client";
import { useState } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Wifi,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ErrorHandler } from "@/lib/errorHandler";
import {
  testSupabaseConnection,
  testSupabaseStorage,
  diagnoseStorageIssue,
} from "@/lib/supabaseTest";
import { DataValidator } from "@/lib/dataValidator";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

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
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

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
      return;
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

  // Fonction pour tester la connexion Supabase
  const testConnection = async () => {
    setLoading(true);
    try {
      const isConnected = await testSupabaseConnection();
      if (isConnected) {
        toast({
          title: "Test réussi",
          description: "La connexion à Supabase fonctionne correctement.",
          variant: "default",
        });
      } else {
        toast({
          title: "Test échoué",
          description: "Problème de connexion à Supabase.",
          variant: "destructive",
        });
      }
    } catch (error) {
      ErrorHandler.logError("Test de connexion", error);
      toast({
        title: "Erreur de test",
        description: "Erreur lors du test de connexion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour tester la connexion au stockage Supabase
  const testStorageConnection = async () => {
    setLoading(true);
    try {
      const result = await testSupabaseStorage();
      if (result.success) {
        toast({
          title: "Test de stockage réussi",
          description:
            "La connexion au stockage Supabase fonctionne correctement.",
          variant: "default",
        });
      } else {
        toast({
          title: "Test de stockage échoué",
          description:
            result.error || "Problème de connexion au stockage Supabase.",
          variant: "destructive",
        });
      }
    } catch (error) {
      ErrorHandler.logError("Test de stockage", error);
      toast({
        title: "Erreur de test",
        description: "Erreur lors du test de stockage.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour diagnostiquer les problèmes de stockage
  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const result = await diagnoseStorageIssue();
      if (result.issue === "none") {
        toast({
          title: "Diagnostic réussi",
          description: "Aucun problème détecté avec le stockage Supabase.",
          variant: "default",
        });
      } else {
        toast({
          title: "Problème détecté",
          description: `Problème: ${result.issue}. Erreur: ${result.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      ErrorHandler.logError("Diagnostic", error);
      toast({
        title: "Erreur de diagnostic",
        description: "Erreur lors du diagnostic.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour valider la connexion Supabase
  const validateSupabaseConnection = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        ErrorHandler.logError("Validation connexion Supabase", error);
        return false;
      }
      return true;
    } catch (error) {
      ErrorHandler.logError("Validation connexion Supabase", error);
      return false;
    }
  };

  // Fonction pour vérifier la structure de la table community
  const validateTableStructure = async (): Promise<boolean> => {
    try {
      // Essayer de récupérer un enregistrement pour vérifier la structure
      const { data, error } = await supabase
        .from("community")
        .select("id, author_id, type, title, content, file_url, created_at")
        .limit(1);

      if (error) {
        ErrorHandler.logError("Validation structure table", error);
        return false;
      }
      return true;
    } catch (error) {
      ErrorHandler.logError("Validation structure table", error);
      return false;
    }
  };

  const createPost = async (postData: any): Promise<boolean> => {
    try {
      console.log("Tentative de création du post:", postData);

      // Validation des données avec le validateur
      const validation = DataValidator.validateCommunityPost(postData);

      if (!validation.isValid) {
        console.error("Données de post invalides:", validation.errors);
        return false;
      }

      const validatedData = validation.validatedData!;
      console.log("Données validées:", validatedData);
      console.log("Envoi des données à Supabase...");

      const { data, error } = await supabase
        .from("community")
        .insert([validatedData])
        .select();

      console.log("Réponse Supabase - data:", data, "error:", error);

      if (error) {
        ErrorHandler.logError("Création de post", error);
        return false;
      }

      if (!data || data.length === 0) {
        console.error("Aucune donnée retournée lors de la création du post");
        return false;
      }

      console.log("Post créé avec succès:", data[0]);
      return true;
    } catch (error) {
      ErrorHandler.logError("Création de post", error);
      return false;
    }
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
      // Valider la connexion Supabase
      const isConnected = await validateSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Erreur de connexion",
          description:
            "Impossible de se connecter au serveur. Veuillez réessayer.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Valider la structure de la table
      const isTableValid = await validateTableStructure();
      if (!isTableValid) {
        toast({
          title: "Erreur de base de données",
          description:
            "Problème avec la structure de la base de données. Veuillez contacter l'administrateur.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Upload du fichier si sélectionné
      let fileUrl = null;
      if (files.length > 0) {
        console.log("Début de l'upload du fichier:", files[0].name);
        console.log("Taille du fichier:", files[0].size, "bytes");
        console.log("Type du fichier:", files[0].type);

        // Upload direct sans vérification préalable du bucket
        try {
          const fileName = `${user.id}/${Date.now()}_${files[0].name}`;
          console.log("Nom du fichier:", fileName);

          console.log("Début de l'upload...");
          const { data, error } = await supabase.storage
            .from("community-uploads")
            .upload(fileName, files[0], {
              cacheControl: "3600",
              upsert: false,
            });

          console.log("Réponse upload - data:", data, "error:", error);

          if (error) {
            console.error("Erreur upload:", error);
            console.error("Type d'erreur:", typeof error);
            console.error("Message d'erreur:", error.message);

            // Gestion spécifique des erreurs Supabase
            if (error.message?.includes("JSON")) {
              toast({
                title: "Erreur de communication",
                description:
                  "Erreur de communication avec le serveur de stockage. Veuillez réessayer.",
                variant: "destructive",
              });
            } else if (
              error.message?.includes("bucket") ||
              error.message?.includes("storage")
            ) {
              toast({
                title: "Erreur de configuration",
                description:
                  "Le bucket de stockage n'est pas accessible. Veuillez contacter l'administrateur.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Erreur upload",
                description:
                  error.message ||
                  "Impossible d'uploader le fichier. Veuillez réessayer.",
                variant: "destructive",
              });
            }
            setLoading(false);
            return;
          }

          if (data && data.path) {
            console.log("Upload réussi:", data.path);
            fileUrl = DataValidator.validateFileUrl(data.path);
            console.log("URL validée:", fileUrl);
          } else {
            console.error("Données d'upload invalides:", data);
            console.error("Type de data:", typeof data);
            toast({
              title: "Erreur upload",
              description: "Réponse d'upload invalide. Veuillez réessayer.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
        } catch (uploadError) {
          console.error("Exception upload complète:", uploadError);
          console.error("Type d'exception:", typeof uploadError);
          console.error(
            "Message d'exception:",
            (uploadError as Error)?.message
          );
          console.error("Stack trace:", (uploadError as Error)?.stack);

          ErrorHandler.logError("Upload de fichier", uploadError);

          const errorMessage = ErrorHandler.getErrorMessage(uploadError);
          toast({
            title: "Erreur upload",
            description: errorMessage,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Créer le post
      const postData = {
        author_id: user.id,
        type: selectedType,
        title: title.trim(),
        content: content.trim(),
        file_url: fileUrl,
      };

      console.log("Données du post:", postData);

      const success = await createPost(postData);

      if (success) {
        toast({
          title: "Post créé avec succès !",
          description: "Votre contenu a été publié dans la communauté.",
          variant: "success",
        });

        setTimeout(() => {
          router.push("/community");
        }, 1500);
      } else {
        // Vérifier s'il y a des erreurs de validation
        const validation = DataValidator.validateCommunityPost(postData);
        if (!validation.isValid && validation.errors) {
          toast({
            title: "Données invalides",
            description: validation.errors.join(", "),
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur lors de la création",
            description: "Impossible de créer le post. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      ErrorHandler.logError("Soumission du formulaire", error);

      const errorMessage = ErrorHandler.getErrorMessage(error);
      toast({
        title: "Erreur",
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
              <Button
                variant="outline"
                size="sm"
                onClick={testConnection}
                disabled={loading}
                className="text-muted-foreground hover:text-foreground"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Wifi className="w-4 h-4 mr-2" />
                )}
                Test Connexion
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={testStorageConnection}
                disabled={loading}
                className="text-muted-foreground hover:text-foreground"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Test Stockage
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={runDiagnostic}
                disabled={loading}
                className="text-muted-foreground hover:text-foreground"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2" />
                )}
                Diagnostic Stockage
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">Créer un post</h1>
                <p className="text-muted-foreground">
                  Partagez votre contenu avec la communauté GTA 6
                </p>
              </div>
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
                    loading || !selectedType || !title.trim() || !content.trim()
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
            </form>
          </div>
        </div>
      </AuthProvider>
    </ProtectedRoute>
  );
}
