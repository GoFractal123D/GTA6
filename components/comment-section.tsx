"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VoteSystem } from "@/components/vote-system";
import { MessageCircle, Reply, Flag, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  createdAt: string;
  votes: { up: number; down: number };
  replies?: Comment[];
}

interface CommentSectionProps {
  itemId: number;
  itemType: "mod" | "post" | "guide";
  comments?: Comment[]; // Ajouté pour recevoir les vrais commentaires
}

export function CommentSection({
  itemId,
  itemType,
  comments: propComments = [],
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(propComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useAuth();

  // Charger les commentaires depuis Supabase
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [itemId]);

  async function fetchComments() {
    setIsLoading(true);
    // 1. Récupérer les commentaires principaux sans jointure
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("mod_id", itemId)
      .is("parent_id", null)
      .order("created_at", { ascending: false });
    if (data) {
      // 2. Pour chaque commentaire, récupérer le profil de l'auteur et les réponses
      const commentsWithReplies = await Promise.all(
        data.map(async (comment: any) => {
          // Récupérer le profil de l'auteur
          let authorProfile = null;
          if (comment.author_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, avatar")
              .eq("id", comment.author_id)
              .single();
            authorProfile = profile;
          }
          // Récupérer les réponses
          const { data: replies } = await supabase
            .from("comments")
            .select("*")
            .eq("parent_id", comment.id)
            .order("created_at", { ascending: true });
          // Pour chaque réponse, récupérer le profil de l'auteur
          const repliesWithAuthors = await Promise.all(
            (replies || []).map(async (reply: any) => {
              let replyProfile = null;
              if (reply.author_id) {
                const { data: profile } = await supabase
                  .from("profiles")
                  .select("username, avatar")
                  .eq("id", reply.author_id)
                  .single();
                replyProfile = profile;
              }
              return {
                id: reply.id,
                author: {
                  name: replyProfile?.username || "Utilisateur",
                  avatar: replyProfile?.avatar_url || "/placeholder-user.jpg",
                },
                content: reply.content,
                createdAt: reply.created_at,
                votes: { up: reply.upvotes || 0, down: reply.downvotes || 0 },
              };
            })
          );
          return {
            id: comment.id,
            author: {
              name: authorProfile?.username || "Utilisateur",
              avatar: authorProfile?.avatar_url || "/placeholder-user.jpg",
            },
            content: comment.content,
            createdAt: comment.created_at,
            votes: { up: comment.upvotes || 0, down: comment.downvotes || 0 },
            replies: repliesWithAuthors,
          };
        })
      );
      setComments(commentsWithReplies);
    }
    setIsLoading(false);
  }

  async function handleSubmitComment() {
    if (!newComment.trim() || !user) return;
    setIsLoading(true);
    setErrorMsg("");
    console.log("[DEBUG] Tentative d'insertion commentaire", {
      mod_id: itemId,
      content: newComment,
      author_id: user.id,
    });
    const { error } = await supabase.from("comments").insert({
      mod_id: itemId,
      content: newComment,
      author_id: user.id,
    });
    if (error) {
      setErrorMsg(
        "Erreur lors de la publication du commentaire : " + error.message
      );
      console.error("[DEBUG] Erreur insertion commentaire", error);
    } else {
      setNewComment("");
      await fetchComments();
    }
    setIsLoading(false);
  }

  async function handleSubmitReply(parentId: number) {
    if (!replyContent.trim() || !user) return;
    setIsReplyLoading(true);
    setErrorMsg("");
    console.log("[DEBUG] Tentative d'insertion réponse", {
      mod_id: itemId,
      content: replyContent,
      parent_id: parentId,
      author_id: user.id,
    });
    const { error } = await supabase.from("comments").insert({
      mod_id: itemId,
      content: replyContent,
      parent_id: parentId,
      author_id: user.id,
    });
    if (error) {
      setErrorMsg(
        "Erreur lors de la publication de la réponse : " + error.message
      );
      console.error("[DEBUG] Erreur insertion réponse", error);
    } else {
      setReplyContent("");
      setReplyingTo(null);
      await fetchComments();
    }
    setIsReplyLoading(false);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Il y a moins d'une heure";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    return date.toLocaleDateString("fr-FR");
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div className={`space-y-3 ${isReply ? "ml-12" : ""}`}>
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <VoteSystem
              itemId={comment.id}
              initialVotes={comment.votes}
              itemType="comment"
              size="sm"
            />

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={comment.author.avatar || "/placeholder.svg"}
                    alt={comment.author.name}
                  />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">
                  {comment.author.name}
                </span>
                {comment.author.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Vérifié
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Flag className="w-4 h-4 mr-2" />
                      Signaler
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm">{comment.content}</p>

              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(comment.id)}
                  className="h-6 text-xs"
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Répondre
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {replyingTo === comment.id && (
        <div className="ml-12 space-y-2">
          {isReplyLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <Textarea
                placeholder="Écrivez votre réponse..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  Répondre
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Annuler
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {errorMsg && (
            <div className="text-red-600 text-sm font-semibold mb-2">
              {errorMsg}
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <>
              <Textarea
                placeholder="Partagez votre avis sur ce mod..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || !user}
                >
                  Publier le commentaire
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun commentaire pour le moment.</p>
          <p className="text-sm">Soyez le premier à partager votre avis !</p>
        </div>
      )}
    </div>
  );
}
