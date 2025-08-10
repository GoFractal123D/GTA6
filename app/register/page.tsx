"use client";
import RegisterForm from "@/components/RegisterForm";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [showLogin, setShowLogin] = useState(false);
  
  return (
    <section className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden z-50">
      {/* Fond immersif GTA 6 */}
      <Image
        src="/gta6-black.jpg"
        alt="GTA 6 Black"
        fill
        className="object-cover object-center absolute inset-0 w-full h-full z-0 opacity-60"
        priority
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="relative z-20 w-full max-w-md mx-auto p-8 rounded-2xl bg-black/70 shadow-2xl border-2 border-pink-500 animate-fade-in flex flex-col items-center">
        {!showLogin ? (
          <>
            <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent text-center drop-shadow-lg">
              Inscription
            </h1>
            <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent text-center drop-shadow-lg">
              Connexion
            </h1>
            <div className="max-w-sm w-full mx-auto bg-card/80 shadow-smooth rounded-xl p-8 mb-8 animate-fade-in">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Connectez-vous à votre compte existant
                </p>
              </div>
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-smooth hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary block text-center"
                >
                  Aller à la page de connexion
                </Link>
                <button
                  onClick={() => setShowLogin(false)}
                  className="w-full py-2 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-background/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Retour à l'inscription
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
