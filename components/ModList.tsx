"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ModList() {
  const [mods, setMods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMods();
  }, []);

  async function fetchMods() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("mods")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("[ModList] Supabase error:", error);
      }
      setMods(data || []);
    } catch (err) {
      console.error("[ModList] JS error:", err);
    }
    setLoading(false);
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!mods.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Aucun mod publié pour le moment.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {mods.map((mod) => (
        <Link
          key={mod.id}
          href={`/mod/${mod.id}`}
          className="hover:scale-105 transition-transform"
        >
          <Card className="overflow-hidden shadow-lg h-full flex flex-col">
            {mod.image && (
              <img
                src={mod.image}
                alt={mod.title}
                className="w-full h-48 object-cover"
              />
            )}
            <CardHeader>
              <CardTitle className="line-clamp-1">{mod.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {mod.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{mod.category || "Sans catégorie"}</span>
                <span>
                  {mod.created_at
                    ? new Date(mod.created_at).toLocaleDateString("fr-FR")
                    : ""}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
