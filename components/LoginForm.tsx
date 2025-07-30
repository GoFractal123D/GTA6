"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  initialMode?: "login" | "register";
}

export default function LoginForm({ initialMode = "login" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    if (isLogin) {
      // Connexion
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Connexion réussie ! Redirection...");
        // Redirection vers la page communauté après connexion
        setTimeout(() => {
          router.push("/community");
        }, 1500);
      }
    } else {
      // Inscription
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Inscription réussie ! Redirection vers la page de connexion...");
        // Redirection vers la page de connexion après inscription
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-sm w-full mx-auto bg-card/80 shadow-smooth rounded-xl p-8 mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? "Connexion" : "Créer un compte"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="exemple@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-smooth hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {loading
            ? "Chargement..."
            : isLogin
            ? "Connexion"
            : "Créer un compte"}
        </button>
      </form>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setSuccess("");
          }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {isLogin
            ? "Pas encore de compte ? S'inscrire"
            : "Déjà inscrit ? Se connecter"}
        </button>
      </div>
      {error && (
        <div className="mt-4 text-sm text-red-500 animate-fade-in">{error}</div>
      )}
      {success && (
        <div className="mt-4 text-sm text-green-600 animate-fade-in">
          {success}
        </div>
      )}
    </div>
  );
}
