"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [step, setStep] = useState<"register" | "confirm">("register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  // Gestion du compte à rebours pour le renvoi du code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const generateConfirmationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sendConfirmationEmail = async (code: string) => {
    try {
      // Appeler l'API pour envoyer l'email de confirmation
      const response = await fetch("/api/auth/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du code");
      }

      // Stocker le code temporairement pour la vérification côté client
      // (en production, ceci ne devrait pas être nécessaire)
      localStorage.setItem(`confirmation_${email}`, code);

      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Vérifier que les mots de passe correspondent
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }

      // Vérifier la longueur minimale du mot de passe
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        setLoading(false);
        return;
      }

      // Générer un code de confirmation à 4 chiffres
      const code = generateConfirmationCode();

      // Envoyer le code par email
      const emailSent = await sendConfirmationEmail(code);

      if (emailSent) {
        setSuccess("Code de confirmation envoyé par email !");
        setStep("confirm");
        setCountdown(60); // 60 secondes avant de pouvoir renvoyer
      } else {
        setError("Erreur lors de l'envoi du code de confirmation");
      }
    } catch (error) {
      setError("Erreur lors de l'inscription");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Appeler l'API pour vérifier le code et créer le compte
      const response = await fetch("/api/auth/verify-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: confirmationCode,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la vérification");
      }

      // Compte créé avec succès
      setSuccess("Compte créé avec succès ! Redirection...");

      // Nettoyer le code temporaire
      localStorage.removeItem(`confirmation_${email}`);

      // Redirection vers la page de connexion
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la confirmation"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;

    setError("");
    setLoading(true);

    try {
      const code = generateConfirmationCode();
      const emailSent = await sendConfirmationEmail(code);

      if (emailSent) {
        setSuccess("Nouveau code envoyé !");
        setCountdown(60);
      } else {
        setError("Erreur lors de l'envoi du nouveau code");
      }
    } catch (error) {
      setError("Erreur lors du renvoi du code");
    } finally {
      setLoading(false);
    }
  };

  if (step === "confirm") {
    return (
      <div className="max-w-sm w-full mx-auto bg-card/80 shadow-smooth rounded-xl p-8 mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Confirmer votre inscription
        </h2>

        <div className="mb-4 text-center text-sm text-muted-foreground">
          <p>Un code de confirmation a été envoyé à :</p>
          <p className="font-semibold text-foreground mt-1">{email}</p>
        </div>

        <form onSubmit={handleConfirmCode} className="space-y-5">
          <div>
            <label
              htmlFor="confirmationCode"
              className="block text-sm font-medium mb-1"
            >
              Code de confirmation (4 chiffres)
            </label>
            <input
              id="confirmationCode"
              type="text"
              value={confirmationCode}
              onChange={(e) =>
                setConfirmationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 4)
                )
              }
              required
              maxLength={4}
              pattern="[0-9]{4}"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-base text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              placeholder="0000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-smooth hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {loading ? "Vérification..." : "Confirmer l'inscription"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={resendCode}
            disabled={countdown > 0}
            className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            {countdown > 0 ? `Renvoyer dans ${countdown}s` : "Renvoyer le code"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setStep("register");
              setError("");
              setSuccess("");
              setConfirmationCode("");
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Retour à l'inscription
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-500 animate-fade-in text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-sm text-green-600 animate-fade-in text-center">
            {success}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-sm w-full mx-auto bg-card/80 shadow-smooth rounded-xl p-8 mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="Votre nom d'utilisateur"
          />
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirmer votre mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className={`w-full rounded-lg border px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              confirmPassword && password !== confirmPassword
                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                : "border-border bg-background"
            }`}
            placeholder="••••••••"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            loading || (confirmPassword && password !== confirmPassword)
          }
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-smooth hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi du code..." : "Envoyer le code de confirmation"}
        </button>
      </form>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Déjà inscrit ? Se connecter
        </button>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-500 animate-fade-in text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 text-sm text-green-600 animate-fade-in text-center">
          {success}
        </div>
      )}
    </div>
  );
}
