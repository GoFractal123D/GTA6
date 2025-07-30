"use client";
import { Shield, AlertTriangle, Users, FileText, Gavel, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-[100px] pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="text-blue-500" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Conditions d'utilisation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="text-blue-500" size={24} />
              Bienvenue sur GTA6 Community
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              En utilisant GTA6 Community, vous acceptez d'être lié par ces conditions d'utilisation. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
            </p>
            <p>
              <strong>GTA6 Community</strong> est une plateforme communautaire dédiée aux fans de Grand Theft Auto 6, 
              permettant le partage, la découverte et la discussion autour des mods et contenus créatifs.
            </p>
          </CardContent>
        </Card>

        {/* Objectif de la plateforme */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="text-purple-500" size={24} />
              Objectif de la plateforme
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              GTA6 Community a pour mission de :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Créer un espace de partage sécurisé pour les créateurs de mods</li>
              <li>Faciliter la découverte de contenus créatifs de qualité</li>
              <li>Encourager les échanges constructifs entre membres</li>
              <li>Promouvoir la créativité et l'innovation dans la communauté GTA</li>
              <li>Maintenir un environnement respectueux et bienveillant</li>
            </ul>
          </CardContent>
        </Card>

        {/* Comportements interdits */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={24} />
              Comportements interdits
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Les comportements suivants sont strictement interdits et peuvent entraîner la suspension 
              ou la suppression de votre compte :
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-red-400">Contenu illégal</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Contenu piraté ou non autorisé</li>
                  <li>Logiciels malveillants ou cheats</li>
                  <li>Violation de droits d'auteur</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-400">Comportements toxiques</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Harcèlement ou intimidation</li>
                  <li>Discours haineux ou discriminatoire</li>
                  <li>Spam ou publicité non autorisée</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Règles de publication */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="text-green-500" size={24} />
              Règles de publication de contenu
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Droits d'auteur</h4>
                <p className="text-sm">
                  Vous devez être le propriétaire ou avoir l'autorisation d'utiliser tout contenu que vous publiez. 
                  Le respect des droits d'auteur est obligatoire.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Respect d'autrui</h4>
                <p className="text-sm">
                  Tout contenu doit respecter les autres utilisateurs. Les critiques constructives sont encouragées, 
                  mais les attaques personnelles sont interdites.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Qualité du contenu</h4>
                <p className="text-sm">
                  Les mods et contenus doivent être fonctionnels et respecter les standards de qualité de la communauté.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsabilité */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gavel className="text-yellow-500" size={24} />
              Responsabilité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Responsabilité de l'utilisateur</h4>
              <p className="text-sm">
                <strong>Le contenu publié reste sous la responsabilité de l'utilisateur.</strong> 
                Vous êtes entièrement responsable du contenu que vous publiez, partagez ou créez sur la plateforme.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Responsabilité de GTA6 Community</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Fournir une plateforme sécurisée et fonctionnelle</li>
                <li>Modérer le contenu selon nos directives</li>
                <li>Protéger la confidentialité des données utilisateur</li>
                <li>Maintenir un environnement communautaire sain</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Modalités de suspension */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={24} />
              Modalités de suspension de compte
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Niveaux de sanction</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span><strong>Avertissement :</strong> Premier manquement aux règles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span><strong>Suspension temporaire :</strong> 1 à 30 jours selon la gravité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span><strong>Bannissement permanent :</strong> Violations graves ou répétées</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Procédure d'appel</h4>
                <p className="text-sm">
                  Si vous pensez qu'une sanction a été appliquée par erreur, vous pouvez contester 
                  en nous contactant à{" "}
                  <Link href="mailto:appeals@gta6community.com" className="text-blue-400 hover:text-blue-300 underline">
                    appeals@gta6community.com
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact et support */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="text-blue-500" size={24} />
              Contact et support
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Pour toute question concernant ces conditions d'utilisation, contactez-nous :
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Support général</h4>
                <Link href="mailto:support@gta6community.com" className="text-blue-400 hover:text-blue-300 underline">
                  support@gta6community.com
                </Link>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Questions légales</h4>
                <Link href="mailto:legal@gta6community.com" className="text-blue-400 hover:text-blue-300 underline">
                  legal@gta6community.com
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8 bg-gray-700" />

        {/* Note de fin */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            Ces conditions d'utilisation peuvent être modifiées à tout moment. 
            Les utilisateurs seront informés des changements importants.
          </p>
        </div>
      </div>
    </div>
  );
} 