"use client";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="fixed inset-0 w-screen min-h-screen flex items-start sm:items-center justify-center overflow-auto sm:overflow-hidden z-50">
      {/* Fond immersif GTA 6 */}
      <Image
        src="/gta6-hero.jpg"
        alt="GTA 6 Hero"
        fill
        className="object-cover object-center absolute inset-0 w-full h-full z-0 opacity-60"
        priority
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-20 w-full max-w-md mx-auto px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 rounded-2xl bg-black/70 shadow-2xl border-2 border-pink-500 animate-fade-in flex flex-col items-center mx-4 sm:mx-6 md:mx-8 my-6 sm:my-8 md:my-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent text-center drop-shadow-lg">
          Connexion
        </h1>
        <LoginForm />
        <p className="mt-6 text-center text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-pink-400 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </section>
  );
}
