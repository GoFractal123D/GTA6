"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { CommentSection } from "@/components/comment-section";
import { supabase } from "@/lib/supabaseClient";

interface ModDetailTabsProps {
  mod: any;
  initialCommentsCount: number;
}

export default function ModDetailTabs({
  mod,
  initialCommentsCount,
}: ModDetailTabsProps) {
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  // Fonction pour mettre à jour le compteur de commentaires
  const updateCommentsCount = async () => {
    const { count } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("mod_id", mod.id);

    setCommentsCount(count || 0);
  };

  // Écouter les changements dans la table des commentaires
  useEffect(() => {
    const subscription = supabase
      .channel(`comments-${mod.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `mod_id=eq.${mod.id}`,
        },
        () => {
          updateCommentsCount();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [mod.id]);

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border-gray-700/50">
        <TabsTrigger
          value="description"
          className="text-xs sm:text-sm data-[state=active]:bg-purple-600/30 data-[state=active]:text-white text-gray-400"
        >
          <span className="hidden sm:inline">Description</span>
          <span className="sm:hidden">Info</span>
        </TabsTrigger>
        <TabsTrigger
          value="installation"
          className="text-xs sm:text-sm data-[state=active]:bg-purple-600/30 data-[state=active]:text-white text-gray-400"
        >
          <span className="hidden sm:inline">Installation</span>
          <span className="sm:hidden">Install</span>
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="text-xs sm:text-sm data-[state=active]:bg-purple-600/30 data-[state=active]:text-white text-gray-400"
        >
          <span className="hidden sm:inline">
            Commentaires ({commentsCount})
          </span>
          <span className="sm:hidden">Com. ({commentsCount})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="description"
        className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
      >
        <Card className="bg-transparent border-gray-700/50">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-white text-lg sm:text-xl">
              À propos de ce mod
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="whitespace-pre-line text-gray-300 text-sm sm:text-base leading-relaxed">
              {mod.description || "Aucune description fournie."}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="installation"
        className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
      >
        <Card className="bg-transparent border-gray-700/50">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-white text-lg sm:text-xl">
              Instructions d'installation
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Suivez ces étapes pour installer le mod correctement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-200">
                    Important
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-300 mt-1">
                    Sauvegardez vos fichiers de jeu avant d'installer ce mod.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 sm:p-4">
              <pre className="whitespace-pre-line text-xs sm:text-sm text-gray-300 overflow-x-auto">
                {mod.installation ||
                  "Aucune instruction d'installation fournie."}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Changelog */}
        {mod.changelog && (
          <Card className="bg-transparent border-gray-700/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-white text-lg sm:text-xl">
                Changelog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 sm:p-4">
                <pre className="whitespace-pre-line text-xs sm:text-sm text-gray-300 overflow-x-auto">
                  {mod.changelog}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prérequis système */}
        {mod.requirements && (
          <Card className="bg-transparent border-gray-700/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-white text-lg sm:text-xl">
                Prérequis système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 sm:p-4">
                <pre className="whitespace-pre-line text-xs sm:text-sm text-gray-300 overflow-x-auto">
                  {mod.requirements}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="comments" className="mt-4 sm:mt-6">
        <div className="bg-transparent border border-gray-700/50 rounded-lg">
          <CommentSection
            itemId={mod.id}
            itemType="mod"
            onCommentUpdate={updateCommentsCount}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
