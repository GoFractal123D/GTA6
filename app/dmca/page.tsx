"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-[100px]">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Politique DMCA</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Procédures de signalement et de retrait de contenu protégé par les
            droits d'auteur
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Qu'est-ce que le DMCA */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Qu'est-ce que le DMCA ?
              </CardTitle>
              <CardDescription className="text-gray-300">
                Comprendre la loi sur les droits d'auteur numérique
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Le Digital Millennium Copyright Act (DMCA) est une loi
                américaine qui protège les droits d'auteur sur Internet. Elle
                établit des procédures pour signaler et retirer du contenu qui
                viole les droits d'auteur.
              </p>
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Notre engagement :
                </h4>
                <p className="text-sm">
                  VIverse respecte les droits de propriété intellectuelle et
                  s'engage à répondre rapidement aux signalements de contenu
                  protégé par les droits d'auteur.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Signalement de violation */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Signaler une violation de droits d'auteur
              </CardTitle>
              <CardDescription className="text-gray-300">
                Procédure pour signaler du contenu protégé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  Important
                </h4>
                <p className="text-gray-300 text-sm">
                  Seuls les titulaires de droits d'auteur ou leurs représentants
                  autorisés peuvent soumettre un signalement DMCA. Les fausses
                  déclarations peuvent entraîner des conséquences légales.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white">
                  Informations requises pour un signalement :
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-white mb-2">
                      1. Identification du titulaire
                    </h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Nom complet et signature</li>
                      <li>• Adresse email valide</li>
                      <li>• Adresse postale</li>
                      <li>• Numéro de téléphone</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-white mb-2">
                      2. Description de l'œuvre
                    </h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Titre de l'œuvre originale</li>
                      <li>• Description détaillée</li>
                      <li>• URL de l'œuvre originale</li>
                      <li>• Preuve de propriété</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-white mb-2">
                      3. Contenu violateur
                    </h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• URL exacte du contenu</li>
                      <li>• Description de la violation</li>
                      <li>• Date de découverte</li>
                      <li>• Captures d'écran (optionnel)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-white mb-2">
                      4. Déclarations légales
                    </h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Bonne foi du signalement</li>
                      <li>• Autorité pour agir</li>
                      <li>• Exactitude des informations</li>
                      <li>• Consentement à la juridiction</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">
                  Formulaire de signalement DMCA
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Envoyez votre signalement par email avec toutes les
                  informations requises :
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <a href="mailto:dmca@gta6community.com?subject=Signalement DMCA">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un signalement DMCA
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Procédure de retrait */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                Procédure de retrait
              </CardTitle>
              <CardDescription className="text-gray-300">
                Ce qui se passe après un signalement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Réception du signalement
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Nous accusons réception dans les 24-48 heures et examinons
                      le signalement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Évaluation</h4>
                    <p className="text-gray-300 text-sm">
                      Notre équipe juridique évalue la validité du signalement
                      et la conformité DMCA.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Retrait du contenu
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Si le signalement est valide, le contenu est retiré dans
                      les 24-72 heures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Notification</h4>
                    <p className="text-gray-300 text-sm">
                      L'utilisateur qui a publié le contenu est notifié et peut
                      soumettre un contre-signalement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                  Délais de traitement
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>
                    • <strong>Signalements urgents :</strong> 24-48 heures
                  </li>
                  <li>
                    • <strong>Signalements standard :</strong> 3-5 jours
                    ouvrables
                  </li>
                  <li>
                    • <strong>Cas complexes :</strong> 7-10 jours ouvrables
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contre-signalement */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Contre-signalement
              </CardTitle>
              <CardDescription className="text-gray-300">
                Comment contester un retrait de contenu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Si vous pensez que votre contenu a été retiré par erreur, vous
                pouvez soumettre un contre-signalement.
              </p>

              <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Motifs de contre-signalement :
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Le contenu est votre œuvre originale</li>
                  <li>• Vous avez l'autorisation d'utiliser le contenu</li>
                  <li>• L'utilisation relève du fair use</li>
                  <li>• Le signalement était erroné ou malveillant</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">
                  Soumettre un contre-signalement
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Incluez toutes les preuves de votre droit d'utiliser le
                  contenu :
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <a href="mailto:dmca@gta6community.com?subject=Contre-signalement DMCA">
                    <Mail className="h-4 w-4 mr-2" />
                    Soumettre un contre-signalement
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Politique de répétition d'infraction */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                Politique de répétition d'infraction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                VIverse applique une politique stricte contre les violations
                répétées des droits d'auteur.
              </p>

              <div className="space-y-3">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-white">
                    Première infraction
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Retrait du contenu et avertissement. L'utilisateur doit
                    confirmer qu'il comprend les règles.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-white">
                    Deuxième infraction
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Suspension temporaire du compte (7-30 jours) et examen
                    obligatoire des directives.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-white">
                    Troisième infraction
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Bannissement permanent du compte et interdiction de créer de
                    nouveaux comptes.
                  </p>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Infractions graves
                </h4>
                <p className="text-gray-300 text-sm">
                  Les violations flagrantes ou commerciales peuvent entraîner un
                  bannissement immédiat et des poursuites légales potentielles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact et ressources */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Mail className="h-5 w-5 mr-2 text-blue-500" />
                Contact et ressources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">
                    Contact DMCA
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Pour tous les signalements et questions liés aux droits
                    d'auteur :
                  </p>
                  <a
                    href="mailto:dmca@gta6community.com"
                    className="text-blue-400 hover:text-blue-300 underline text-sm"
                  >
                    dmca@gta6community.com
                  </a>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">
                    Contact légal général
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Pour les autres questions juridiques :
                  </p>
                  <a
                    href="mailto:legal@gta6community.com"
                    className="text-blue-400 hover:text-blue-300 underline text-sm"
                  >
                    legal@gta6community.com
                  </a>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Ressources utiles
                </h4>
                <div className="space-y-2 text-sm">
                  <a
                    href="https://www.copyright.gov/dmca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline flex items-center"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Site officiel du DMCA (US Copyright Office)
                  </a>
                  <a
                    href="/terms"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Nos conditions d'utilisation
                  </a>
                  <a
                    href="/guidelines"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Directives communautaires
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
