"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

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

    setLoading(false);
  };

  return (
    <div className="max-w-sm w-full mx-auto bg-card/80 shadow-smooth rounded-xl p-8 mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Connexion
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
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-smooth hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {loading ? "Chargement..." : "Connexion"}
        </button>
      </form>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Pas encore de compte ? S'inscrire
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
