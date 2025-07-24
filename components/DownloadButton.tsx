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
  const handleDownload = () => {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mods-files/${file}`;
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
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:text-white active:scale-110 transition-transform transition-colors"
      style={{ marginBottom: 8 }}
      type="button"
    >
      <Download className="w-4 h-4" />
      Télécharger le fichier {idx + 1}
    </Button>
  );
}
