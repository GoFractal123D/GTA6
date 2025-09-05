"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  FileArchive,
  ImageIcon,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SubmitModPage() {
  const [modFiles, setModFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  // Nouveaux états pour chaque champ du formulaire
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [installation, setInstallation] = useState("");
  const [changelog, setChangelog] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = (files: FileList | null, type: "mod" | "images") => {
    if (!files) return;

    const fileArray = Array.from(files);
    if (type === "mod") {
      setModFiles((prev) => [...prev, ...fileArray]);
    } else {
      setImages((prev) => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number, type: "mod" | "images") => {
    if (type === "mod") {
      setModFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Upload helper
  async function uploadFileToStorage(file: File, folder: string) {
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(folder)
      .upload(filePath, file);
    if (error) throw error;
    return data.path;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!user) {
      setError("Tu dois être connecté pour publier un mod.");
      setLoading(false);
      return;
    }
    try {
      console.log("[DEBUG] Début upload fichiers");
      // Upload des fichiers du mod
      let modFilesPaths = [];
      for (const file of modFiles) {
        const path = await uploadFileToStorage(file, "mods-files");
        modFilesPaths.push(path);
      }
      console.log("[DEBUG] Début upload images");
      // Upload des images
      let imagePaths = [];
      for (const file of images) {
        const path = await uploadFileToStorage(file, "mods-images");
        imagePaths.push(path);
      }
      // Log détaillé des types et valeurs envoyés à Supabase
      const payload = {
        title,
        version,
        description,
        category,
        tags,
        installation,
        changelog,
        requirements,
        author_id: user.id,
        files: modFilesPaths,
        images: imagePaths,
      };
      console.log("[DEBUG] Début du log détaillé des champs");
      Object.entries(payload).forEach(([key, value]) => {
        console.log(
          `[DEBUG] Champ: ${key}, Type: ${
            Array.isArray(value) ? "array" : typeof value
          }, Valeur:`,
          value
        );
        if (
          (key === "title" || key === "description" || key === "author_id") &&
          (value === undefined || value === null || value === "")
        ) {
          console.warn(`[WARNING] Champ obligatoire manquant ou vide: ${key}`);
        }
      });
      // Insertion dans la table mods
      console.log("[DEBUG] Début insertion Supabase");
      const { data, error: insertError } = await supabase
        .from("mods")
        .insert([payload]);
      if (insertError) throw insertError;
      setSuccess("Mod publié avec succès !");
      setTitle("");
      setVersion("");
      setDescription("");
      setCategory("");
      setTags([]);
      setInstallation("");
      setChangelog("");
      setRequirements("");
      setModFiles([]);
      setImages([]);
      // Redirection immédiate vers la page des mods
      router.push("/mods");
    } catch (err) {
      console.error("[DEBUG] Erreur lors de l'upload ou de l'insertion :", err);
      if (err instanceof Error) {
        setError(err.message || "Erreur lors de la publication du mod.");
      } else {
        setError("Erreur lors de la publication du mod.");
      }
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-full w-full sm:max-w-2xl mx-auto pt-32 pb-20 px-2 sm:px-4 space-y-8">
        {/* Bouton retour */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-muted/50 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link href="/mods">
              <ArrowLeft className="w-4 h-4" />
              Retour aux mods
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Publier un mod</h1>
          <p className="text-muted-foreground mt-2">
            Partagez votre création avec la communauté GTA 6
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Décrivez votre mod pour aider les utilisateurs à le comprendre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du mod *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Enhanced Graphics Pack"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    placeholder="Ex: 1.0.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre mod, ses fonctionnalités, et ce qu'il apporte au jeu..."
                  className="min-h-[120px]"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select required value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="graphics">Graphismes</SelectItem>
                    <SelectItem value="gameplay">Gameplay</SelectItem>
                    <SelectItem value="vehicles">Véhicules</SelectItem>
                    <SelectItem value="weapons">Armes</SelectItem>
                    <SelectItem value="maps">Cartes</SelectItem>
                    <SelectItem value="characters">Personnages</SelectItem>
                    <SelectItem value="ui">Interface</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter un tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Fichiers du mod</CardTitle>
              <CardDescription>
                Uploadez les fichiers de votre mod (.zip recommandé)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fichiers du mod *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <FileArchive className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Glissez-déposez vos fichiers ici ou cliquez pour
                    sélectionner
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".zip,.rar,.7z"
                    onChange={(e) => handleFileUpload(e.target.files, "mod")}
                    className="hidden"
                    id="mod-files"
                  />
                  <Button asChild type="button">
                    <label htmlFor="mod-files" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Sélectionner les fichiers
                    </label>
                  </Button>
                </div>

                {modFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Fichiers sélectionnés:</Label>
                    {modFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, "mod")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images et captures d'écran</CardTitle>
              <CardDescription>
                Ajoutez des images pour présenter votre mod
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Images (optionnel)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Ajoutez des captures d'écran de votre mod
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, "images")}
                    className="hidden"
                    id="mod-images"
                  />
                  <Button asChild type="button" variant="outline">
                    <label htmlFor="mod-images" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Sélectionner les images
                    </label>
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => removeFile(index, "images")}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Installation & Changelog */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions et changelog</CardTitle>
              <CardDescription>
                Aidez les utilisateurs à installer et comprendre votre mod
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="installation">
                  Instructions d'installation
                </Label>
                <Textarea
                  id="installation"
                  placeholder="1. Téléchargez le fichier .zip&#10;2. Extrayez dans le dossier mods/&#10;3. Lancez le jeu..."
                  className="min-h-[100px]"
                  value={installation}
                  onChange={(e) => setInstallation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="changelog">Changelog</Label>
                <Textarea
                  id="changelog"
                  placeholder="v1.0.0:&#10;- Première version&#10;- Amélioration des textures&#10;- Correction de bugs..."
                  className="min-h-[100px]"
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Prérequis système</Label>
                <Textarea
                  id="requirements"
                  placeholder="- GTA 6 version 1.0 ou supérieure&#10;- 4GB RAM minimum&#10;- Carte graphique compatible DirectX 12..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    J'accepte les conditions d'utilisation et confirme que ce
                    mod ne contient pas de contenu malveillant
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="original" required />
                  <Label htmlFor="original" className="text-sm">
                    Je confirme être l'auteur original de ce mod ou avoir les
                    droits nécessaires pour le publier
                  </Label>
                </div>

                {error && (
                  <div className="text-red-500 font-semibold">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 font-semibold">{success}</div>
                )}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full max-w-md"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {loading ? "Publication..." : "Publier le mod"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </ProtectedRoute>
  );
}
