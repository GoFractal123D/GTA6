"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { User, Download, Puzzle } from "lucide-react";

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-x-hidden pt-[45px]">
      {/* Hero immersive */}
      <div className="relative w-screen min-h-[60vh] py-20 mb-10 overflow-hidden">
        <Image
          src="/gta6-hero.jpg"
          alt="GTA 6 City"
          fill
          className="object-cover object-center absolute left-0 top-0 w-full h-full opacity-40"
          priority
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
            GTA 6 Community
          </h1>
          <p className="mt-6 text-2xl md:text-3xl text-gray-200 max-w-2xl mx-auto animate-fade-in">
            La plateforme ultime pour partager, découvrir et voter sur les mods,
            guides, vidéos et plus autour de GTA 6.
          </p>
          <div className="mt-10 flex gap-6 animate-fade-in">
            <Button
              asChild
              size="lg"
              variant="default"
              className="text-lg px-8 py-4 shadow-xl"
            >
              <Link href="/register">Rejoindre la communauté</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 shadow-xl"
            >
              <Link href="/mods">Découvrir les mods</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bannière d’actualité */}
      <div className="w-full flex justify-center mb-10 animate-pulse">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg max-w-3xl w-full text-center">
          🚨 Dernière news : Lancement officiel de GTA 6 Community ! Découvrez
          les nouveaux mods et fonctionnalités.{" "}
          <Link href="/community" className="underline font-semibold ml-2">
            En savoir plus
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <section className="w-full max-w-5xl mx-auto mb-32 px-4 pt-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Statistiques de la communauté
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-background/80 rounded-2xl p-8 shadow-xl flex flex-col items-center min-w-[180px] hover:scale-105 transition-transform">
            <Puzzle className="text-blue-400 mb-2" size={40} />
            <span className="text-4xl font-extrabold text-blue-400">1 245</span>
            <span className="text-muted-foreground">Mods publiés</span>
          </div>
          <div className="bg-background/80 rounded-2xl p-8 shadow-xl flex flex-col items-center min-w-[180px] hover:scale-105 transition-transform">
            <User className="text-purple-400 mb-2" size={40} />
            <span className="text-4xl font-extrabold text-purple-400">
              3 678
            </span>
            <span className="text-muted-foreground">Membres</span>
          </div>
          <div className="bg-background/80 rounded-2xl p-8 shadow-xl flex flex-col items-center min-w-[180px] hover:scale-105 transition-transform">
            <Download className="text-pink-400 mb-2" size={40} />
            <span className="text-4xl font-extrabold text-pink-400">
              12 540
            </span>
            <span className="text-muted-foreground">Téléchargements</span>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section className="w-full max-w-5xl mx-auto mb-32 px-4 pt-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
          Qu'est-ce que GTA 6 Community ?
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-8">
          GTA 6 Community est un espace ouvert où chaque joueur peut publier,
          commenter, voter et partager ses créations ou découvertes : mods,
          guides, vidéos, théories, etc.
          <br />
          Notre mission : rassembler la meilleure communauté autour de GTA 6,
          dans un environnement moderne, sécurisé et immersif.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-background/80 rounded-xl p-6 shadow flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-2xl font-bold mb-2 text-blue-400">
              Publie du contenu
            </span>
            <span className="text-muted-foreground text-center">
              Mods, guides, vidéos, théories, images, changelogs...
            </span>
          </div>
          <div className="bg-background/80 rounded-xl p-6 shadow flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-2xl font-bold mb-2 text-purple-400">
              Vote & commente
            </span>
            <span className="text-muted-foreground text-center">
              Soutiens les meilleures créations, donne ton avis, fais grandir la
              communauté.
            </span>
          </div>
          <div className="bg-background/80 rounded-xl p-6 shadow flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-2xl font-bold mb-2 text-pink-400">
              Découvre & classe
            </span>
            <span className="text-muted-foreground text-center">
              Explore les contenus populaires, récents ou sponsorisés, découvre
              de nouveaux talents.
            </span>
          </div>
        </div>
      </section>

      {/* FAQ / Guide de démarrage */}
      <section className="w-full max-w-4xl mx-auto mb-32 px-4 pt-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 flex-shrink-0 flex justify-center">
            <Image
              src="/gta6-plan.jpg"
              alt="Plan GTA 6"
              width={300}
              height={300}
              className="rounded-xl shadow-lg object-cover"
              style={{ maxHeight: 260, width: "100%", objectFit: "cover" }}
              priority={false}
            />
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left text-white">
              FAQ & Guide de démarrage
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment publier un mod ?</AccordionTrigger>
                <AccordionContent>
                  Crée un compte, va dans "Publier un mod" et remplis le
                  formulaire avec tes fichiers et une description.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Comment voter ou commenter ?
                </AccordionTrigger>
                <AccordionContent>
                  Connecte-toi, puis utilise les boutons de vote ou le champ de
                  commentaire sous chaque mod.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Est-ce gratuit ?</AccordionTrigger>
                <AccordionContent>
                  Oui, la plateforme est 100% gratuite pour tous les membres.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Où trouver plus d'aide ?</AccordionTrigger>
                <AccordionContent>
                  Consulte la{" "}
                  <Link href="/faq" className="underline">
                    FAQ complète
                  </Link>{" "}
                  ou contacte le support.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Témoignages utilisateurs */}
      <section className="w-full max-w-5xl mx-auto mb-32 px-4 pt-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Ils parlent de nous
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-background/80 rounded-2xl p-8 shadow-xl flex flex-col items-center hover:scale-105 transition-transform">
            <span className="italic text-muted-foreground mb-4">
              “La meilleure plateforme pour partager mes mods, la communauté est
              super active !”
            </span>
            <span className="font-semibold text-primary">- AlexModder</span>
          </div>
          <div className="bg-background/80 rounded-2xl p-8 shadow-xl flex flex-col items-center hover:scale-105 transition-transform">
            <span className="italic text-muted-foreground mb-4">
              “J’ai trouvé plein de guides utiles et des mods incroyables, bravo
              à l’équipe !”
            </span>
            <span className="font-semibold text-primary">- GamerLina</span>
          </div>
          <div className="bg-background/80 rounded-2xl p-8 shadow-xl flex flex-col items-center hover:scale-105 transition-transform">
            <span className="italic text-muted-foreground mb-4">
              “Simple, rapide, et sécurisé. Je recommande à tous les fans de GTA
              !”
            </span>
            <span className="font-semibold text-primary">- NicoV6</span>
          </div>
        </div>
      </section>
    </div>
  );
}
