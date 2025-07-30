"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Mail,
  Shield,
  Users,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 via-black to-black border-t border-gray-800">
      {/* Section principale du footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src="/logo-site.png"
                alt="VIverse Logo"
                width={48}
                height={48}
                className="rounded-lg mr-3"
              />
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                VIverse
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              La plateforme communautaire ultime pour les fans de jeux vidéo.
              Partagez, découvrez et votez pour les meilleurs mods et contenus.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Youtube size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <Github size={20} />
              </Link>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/mods"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Mods
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Communauté
                </Link>
              </li>
              <li>
                <Link
                  href="/submit-mod"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Publier un mod
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Support et aide */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Directives communautaires
                </Link>
              </li>
              <li>
                <Link
                  href="/dmca"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Politique DMCA
                </Link>
              </li>
            </ul>
          </div>

          {/* Statistiques et contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Communauté</h3>
            <div className="space-y-3">
              {/* <div className="flex items-center text-gray-400 text-sm">
                <Users size={16} className="mr-2" />
                <span>+10,000 membres</span>
              </div> */}
              <div className="flex items-center text-gray-400 text-sm">
                <Shield size={16} className="mr-2" />
                <span>Plateforme sécurisée</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Heart size={16} className="mr-2" />
                <span>100% gratuit</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Nous contacter</h4>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white dark:text-white text-black"
                asChild
              >
                <Link href="mailto:contact@gta6community.com">
                  <Mail size={16} className="mr-2" />
                  Contact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Section mention légale */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-red-500" />
            🔐 Clause de non-affiliation – GTA6 / Rockstar Games
          </h4>
          <p className="text-gray-300 text-sm mb-3">
            Ce site est une plateforme indépendante créée par des fans et n'est
            en aucun cas affiliée, sponsorisée ou approuvée par Rockstar Games,
            Take-Two Interactive, ou toute entité associée.
          </p>
          <p className="text-gray-300 text-sm mb-3">
            <strong>Grand Theft Auto®</strong>, <strong>GTA®</strong>,{" "}
            <strong>GTA6®</strong>,<strong>Rockstar Games®</strong> et tous les
            noms, marques, logos, caractères, graphismes et autres éléments
            associés sont des marques déposées et propriétés exclusives de leurs
            titulaires respectifs.
          </p>
          <p className="text-gray-300 text-sm mb-3">
            Toute référence à "GTA6" sur ce site est faite à des fins
            informatives, communautaires ou culturelles, dans le respect des
            droits de propriété intellectuelle.
          </p>
          <p className="text-gray-300 text-sm mb-3">
            <strong>Images et contenu visuel :</strong> Les images utilisées sur
            ce site sont soit des créations originales, soit utilisées dans le
            cadre du fair use à des fins éducatives et informatives. Nous ne
            revendiquons aucun droit de propriété sur les éléments visuels
            appartenant à Rockstar Games.
          </p>
          <p className="text-gray-300 text-sm">
            Si vous êtes représentant légal de Rockstar Games ou Take-Two
            Interactive et souhaitez signaler un contenu, merci de nous
            contacter à{" "}
            <a
              href="mailto:legal@gta6community.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              legal@gta6community.com
            </a>{" "}
            pour que nous puissions agir rapidement.
          </p>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="mb-4 md:mb-0">
            © {currentYear} VIverse. Tous droits réservés.
            <span className="ml-2">
              Créé avec ❤️ par des fans pour des fans.
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Conditions
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Confidentialité
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link>
            <Link href="/dmca" className="hover:text-white transition-colors">
              DMCA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
