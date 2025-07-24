"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ModsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [mods, setMods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMods();
  }, [search]);

  async function fetchMods() {
    setLoading(true);
    let query = supabase.from("mods").select("*");
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
    const { data, error } = await query;
    if (!error) setMods(data || []);
    setLoading(false);
  }

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t("mods.title")}</h1>
          <p className="text-muted-foreground">{t("mods.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/submit-mod">{t("mods.publish")}</Link>
        </Button>
      </div>
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder={t("mods.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96"
        />
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          {t("mods.loading")}
        </div>
      ) : mods.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {t("mods.noModsFound")}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mods.map((mod) => (
            <div
              key={mod.id}
              className="bg-background/80 rounded-xl shadow-lg p-6 flex flex-col justify-between border border-pink-500/30"
            >
              <h2 className="text-xl font-bold mb-2">{mod.title}</h2>
              <p className="text-muted-foreground mb-2 line-clamp-2">
                {mod.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{mod.category || t("mods.noCategory")}</span>
                <span>
                  {mod.created_at
                    ? new Date(mod.created_at).toLocaleDateString("fr-FR")
                    : ""}
                </span>
              </div>
              <Link
                href={`/mod/${mod.id}`}
                className="mt-2 inline-block px-4 py-2 rounded bg-primary text-white text-sm font-semibold text-center hover:bg-primary/90 transition-colors"
              >
                {t("mods.viewMod")}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
