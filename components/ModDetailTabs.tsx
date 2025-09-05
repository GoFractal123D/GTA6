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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="installation">Installation</TabsTrigger>
        <TabsTrigger value="comments">
          Commentaires ({commentsCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>À propos de ce mod</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{mod.description}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="installation">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions d'installation</CardTitle>
            <CardDescription>
              Ajoute ici les instructions d'installation si besoin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Important
                  </p>
                  <p className="text-sm text-yellow-700">
                    Sauvegardez vos fichiers de jeu avant d'installer ce mod.
                  </p>
                </div>
              </div>
            </div>
            <pre className="whitespace-pre-line text-sm bg-muted p-4 rounded-lg">
              {mod.installation || "Aucune instruction fournie."}
            </pre>
          </CardContent>
        </Card>

        {/* Changelog */}
        {mod.changelog && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Changelog</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-line text-sm bg-muted p-4 rounded-lg">
                {mod.changelog}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Prérequis système */}
        {mod.requirements && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Prérequis système</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-line text-sm bg-muted p-4 rounded-lg">
                {mod.requirements}
              </pre>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="comments">
        <CommentSection
          itemId={mod.id}
          itemType="mod"
          onCommentUpdate={updateCommentsCount}
        />
      </TabsContent>
    </Tabs>
  );
}
