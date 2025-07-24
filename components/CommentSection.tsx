"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import VoteButton from "./VoteButton";

export default function CommentSection({ modId }: { modId: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [modId]);

  async function fetchComments() {
    setLoading(true);
    const { data } = await supabase
      .from("comments")
      .select("*, author:profiles(username)")
      .eq("mod_id", modId)
      .is("parent_id", null)
      .order("created_at", { ascending: false });
    setComments(data || []);
    setLoading(false);
  }

  async function postComment() {
    if (!content.trim()) return;
    setLoading(true);
    await supabase.from("comments").insert({
      mod_id: modId,
      author_id: user.id,
      content,
    });
    setContent("");
    fetchComments();
  }

  return (
    <div>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={postComment} disabled={loading || !user}>
          Publier
        </button>
      </div>
      {loading && <div>Chargement...</div>}
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <b>{c.author?.username}</b> : {c.content}
            <VoteButton targetType="comment" targetId={c.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
