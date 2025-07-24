"use client";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [mods, setMods] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchProfile();
    fetchUserMods();
    fetchUserComments();
    fetchUserVotes();
    fetchUserDownloads();
  }, [user]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (!error) setProfile(data);
  }
  async function fetchUserMods() {
    const { data } = await supabase
      .from("mods")
      .select("*")
      .eq("user_id", user.id);
    setMods(data || []);
  }
  async function fetchUserComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("user_id", user.id);
    setComments(data || []);
  }
  async function fetchUserVotes() {
    const { data } = await supabase
      .from("mod_ratings")
      .select("*")
      .eq("user_id", user.id);
    setVotes(data || []);
  }
  async function fetchUserDownloads() {
    const { data } = await supabase
      .from("downloads")
      .select("*")
      .eq("user_id", user.id);
    setDownloads(data || []);
  }

  if (!user) {
    return (
      <div className="pt-24 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-pink-500">
          {t("profile.username")}
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          {t("profile.noCommentsYet")}
        </p>
        <Link
          href="/login"
          className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
        >
          {t("profile.login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-3xl mx-auto px-4">
      {/* Header profil avec fond image limité */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-8 flex items-center">
        <Image
          src="/gta6-hero.jpg"
          alt="GTA 6 Hero"
          fill
          className="object-cover object-center w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 flex items-center gap-6 px-8">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-pink-500 bg-background overflow-hidden flex items-center justify-center shadow-lg">
              <Image
                src={profile?.avatar_url || "/placeholder-user.jpg"}
                alt={profile?.username || user.email}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="mt-2 px-3 py-1 rounded bg-pink-600/80 text-white text-xs font-semibold">
              {t("profile.memberSince")}{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString("fr-FR")
                : "?"}
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
              {profile?.username || user.email}
            </h1>
            <p className="text-muted-foreground text-base">
              {profile?.description || t("profile.description")}
            </p>
          </div>
        </div>
      </div>
      {/* Mes mods */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-pink-400">
          {t("profile.myPublishedMods")}
        </h2>
        {mods.length === 0 ? (
          <div className="text-muted-foreground">
            {t("profile.noModsPublishedYet")}
          </div>
        ) : (
          <div className="space-y-2">
            {mods.map((mod) => (
              <div
                key={mod.id}
                className="bg-background/80 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between border border-pink-500/30"
              >
                <div>
                  <span className="font-semibold text-lg">{mod.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    v{mod.version}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {mod.category}
                  </span>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Link
                    href={`/mod/${mod.id}`}
                    className="px-3 py-1 rounded bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 transition-colors"
                  >
                    {t("profile.viewMod")}
                  </Link>
                  <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                    {t("profile.edit")}
                  </button>
                  <button className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors">
                    {t("profile.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Mes commentaires */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-pink-400">
          {t("profile.myComments")}
        </h2>
        {comments.length === 0 ? (
          <div className="text-muted-foreground">
            {t("profile.noCommentsYet")}
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-background/80 rounded-lg p-4 border border-pink-500/30"
              >
                <div className="font-semibold">{comment.content}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t("profile.postedOn")}{" "}
                  {comment.created_at
                    ? new Date(comment.created_at).toLocaleDateString("fr-FR")
                    : "?"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Mes votes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-pink-400">
          {t("profile.myVotes")}
        </h2>
        {votes.length === 0 ? (
          <div className="text-muted-foreground">{t("profile.noVotesYet")}</div>
        ) : (
          <div className="space-y-2">
            {votes.map((vote) => (
              <div
                key={vote.id}
                className="bg-background/80 rounded-lg p-4 border border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between"
              >
                <div>
                  <span className="font-semibold">
                    {t("profile.rating")} {vote.rating}★
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {t("profile.givenOn")}{" "}
                    {vote.created_at
                      ? new Date(vote.created_at).toLocaleDateString("fr-FR")
                      : "?"}
                  </span>
                </div>
                <Link
                  href={`/mod/${vote.mod_id}`}
                  className="px-3 py-1 rounded bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 transition-colors mt-2 md:mt-0"
                >
                  {t("profile.viewMod")}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Mon historique de téléchargements */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-pink-400">
          {t("profile.myDownloadHistory")}
        </h2>
        {downloads.length === 0 ? (
          <div className="text-muted-foreground">
            {t("profile.noDownloadsYet")}
          </div>
        ) : (
          <div className="space-y-2">
            {downloads.map((dl) => (
              <div
                key={dl.id}
                className="bg-background/80 rounded-lg p-4 border border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between"
              >
                <div>
                  <span className="font-semibold">
                    {t("profile.file")} {dl.file_name || dl.file_path || "?"}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {t("profile.downloadedOn")}{" "}
                    {dl.created_at
                      ? new Date(dl.created_at).toLocaleDateString("fr-FR")
                      : "?"}
                  </span>
                </div>
                <Link
                  href={`/mod/${dl.mod_id}`}
                  className="px-3 py-1 rounded bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 transition-colors mt-2 md:mt-0"
                >
                  {t("profile.viewMod")}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Statistiques personnelles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-pink-400">
          {t("profile.personalStats")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center justify-center bg-background/80 rounded-lg p-4 border border-pink-500/30">
            <span className="text-3xl font-bold text-pink-400">
              {mods.length}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {t("profile.modsPublished")}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-background/80 rounded-lg p-4 border border-pink-500/30">
            <span className="text-3xl font-bold text-blue-400">
              {downloads.length}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {t("profile.totalDownloads")}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-background/80 rounded-lg p-4 border border-pink-500/30">
            <span className="text-3xl font-bold text-yellow-400">
              {votes.length > 0
                ? (
                    votes.reduce((acc, v) => acc + v.rating, 0) / votes.length
                  ).toFixed(1)
                : "0.0"}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {t("profile.averageRating")}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-background/80 rounded-lg p-4 border border-pink-500/30">
            <span className="text-3xl font-bold text-green-400">
              {comments.length}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {t("profile.commentsReceived")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
