"use client";
import CommunityForm from "@/components/CommunityForm";
import CommunityFeed from "@/components/CommunityFeed";
import { AuthProvider } from "@/components/AuthProvider";

export default function CommunityPage() {
  return (
    <AuthProvider>
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Espace Communautaire
        </h1>
        <CommunityForm />
        <CommunityFeed />
      </div>
    </AuthProvider>
  );
}
