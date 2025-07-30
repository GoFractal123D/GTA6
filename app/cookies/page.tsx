"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Cookie, 
  Shield, 
  Settings, 
  Eye, 
  BarChart3, 
  Users, 
  Lock,
  ExternalLink,
  Mail
} from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Cookie className="h-12 w-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Politique des Cookies</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Découvrez comment nous utilisons les cookies pour améliorer votre expérience 
            sur GTA6 Community et comment vous pouvez les gérer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Qu'est-ce qu'un cookie */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Cookie className="h-5 w-5 mr-2 text-blue-500" />
                Qu'est-ce qu'un cookie ?
              </CardTitle>
              <CardDescription className="text-gray-300">
                Comprendre le fonctionnement des cookies sur notre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, 
                tablette, smartphone) lorsque vous visitez un site web. Les cookies permettent 
                au site de "se souvenir" de vos actions et préférences sur une période donnée.
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Fonctions principales :</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Authentification :</strong> Maintenir votre connexion entre les sessions</li>
                  <li>• <strong>Préférences :</strong> Sauvegarder vos choix (thème, langue, etc.)</li>
                  <li>• <strong>Analytics :</strong> Comprendre l'utilisation du site pour l'améliorer</li>
                  <li>• <strong>Sécurité :</strong> Protéger contre les attaques et fraudes</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Types de cookies utilisés */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="h-5 w-5 mr-2 text-green-500" />
                Types de cookies utilisés
              </CardTitle>
              <CardDescription className="text-gray-300">
                Classification détaillée des cookies présents sur notre site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cookies essentiels */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  Cookies essentiels (obligatoires)
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• <strong>Session :</strong> Maintien de votre connexion utilisateur</li>
                  <li>• <strong>Sécurité :</strong> Protection CSRF et authentification</li>
                  <li>• <strong>Préférences techniques :</strong> Thème, langue, paramètres d'affichage</li>
                </ul>
              </div>

              {/* Cookies analytiques */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                  Cookies analytiques (optionnels)
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Ces cookies nous aident à comprendre comment le site est utilisé pour l'améliorer.
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• <strong>Google Analytics :</strong> Statistiques de visite et comportement utilisateur</li>
                  <li>• <strong>Performance :</strong> Mesure des temps de chargement et erreurs</li>
                  <li>• <strong>Navigation :</strong> Pages les plus visitées et parcours utilisateur</li>
                </ul>
              </div>

              {/* Cookies de fonctionnalité */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-500" />
                  Cookies de fonctionnalité (optionnels)
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Ces cookies améliorent votre expérience en mémorisant vos préférences.
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• <strong>Personnalisation :</strong> Contenu recommandé selon vos intérêts</li>
                  <li>• <strong>Interface :</strong> Disposition et options d'affichage personnalisées</li>
                  <li>• <strong>Social :</strong> Intégration avec les réseaux sociaux</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des cookies */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Eye className="h-5 w-5 mr-2 text-yellow-500" />
                Comment gérer vos cookies
              </CardTitle>
              <CardDescription className="text-gray-300">
                Options pour contrôler l'utilisation des cookies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Paramètres du navigateur</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Vous pouvez configurer votre navigateur pour refuser tous les cookies ou 
                    être informé quand un cookie est envoyé.
                  </p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</p>
                    <p><strong>Firefox :</strong> Options → Confidentialité et sécurité → Cookies</p>
                    <p><strong>Safari :</strong> Préférences → Confidentialité → Cookies</p>
                    <p><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Notre panneau de gestion</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Utilisez notre interface pour contrôler précisément quels types de cookies 
                    vous acceptez sur notre site.
                  </p>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Gérer mes préférences
                  </Button>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-blue-500" />
                  Important à savoir
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• La désactivation de certains cookies peut affecter le fonctionnement du site</li>
                  <li>• Les cookies essentiels ne peuvent pas être désactivés pour des raisons de sécurité</li>
                  <li>• Vos préférences sont sauvegardées localement sur votre appareil</li>
                  <li>• Vous pouvez modifier vos choix à tout moment</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookies tiers */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <ExternalLink className="h-5 w-5 mr-2 text-orange-500" />
                Cookies tiers
              </CardTitle>
              <CardDescription className="text-gray-300">
                Services externes qui peuvent placer des cookies sur votre appareil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-white">Google Analytics</h4>
                  <p className="text-gray-300 text-sm">
                    Utilisé pour analyser l'utilisation du site et améliorer nos services.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-white">Supabase</h4>
                  <p className="text-gray-300 text-sm">
                    Notre base de données et service d'authentification.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-white">Vercel</h4>
                  <p className="text-gray-300 text-sm">
                    Notre plateforme d'hébergement et de déploiement.
                  </p>
                </div>
              </div>

              <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
                <p className="text-gray-300 text-sm">
                  <strong>Note :</strong> Ces services tiers ont leurs propres politiques de confidentialité. 
                  Nous vous encourageons à les consulter pour plus d'informations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mise à jour de la politique */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="h-5 w-5 mr-2 text-gray-400" />
                Mise à jour de cette politique
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Cette politique des cookies peut être mise à jour périodiquement pour refléter 
                les changements dans nos pratiques ou pour d'autres raisons opérationnelles, 
                légales ou réglementaires.
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Dernière mise à jour :</h4>
                <p className="text-gray-300">Décembre 2024</p>
                <p className="text-gray-300 text-sm mt-2">
                  Nous vous informerons de tout changement significatif via une notification 
                  sur le site ou par email.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Mail className="h-5 w-5 mr-2 text-blue-500" />
                Questions sur les cookies ?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-4">
                Si vous avez des questions concernant notre utilisation des cookies ou 
                souhaitez exercer vos droits, n'hésitez pas à nous contacter :
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email :</strong>{" "}
                  <a 
                    href="mailto:privacy@gta6community.com" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    privacy@gta6community.com
                  </a>
                </p>
                <p>
                  <strong>DPO :</strong>{" "}
                  <a 
                    href="mailto:dpo@gta6community.com" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    dpo@gta6community.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 