"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadButton({
  file,
  idx,
}: {
  file: string;
  idx: number;
}) {
  if (!file) return null; // Ne rien afficher si le chemin est vide
  const handleDownload = () => {
    const url = `https://lxazszzgjjwwfifvkfue.supabase.co/storage/v1/object/public/mods-files/${file}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleDownload}
      size="icon"
      className="rounded-full w-12 h-12 bg-primary text-white hover:bg-primary/90 hover:text-white active:scale-110 transition-transform transition-colors shadow-lg"
      style={{ marginBottom: 8 }}
      type="button"
      title={`Télécharger le fichier ${idx + 1}`}
    >
      <Download className="w-5 h-5" />
    </Button>
  );
}
