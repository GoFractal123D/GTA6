"use client";
import {
  HelpCircle,
  Download,
  Upload,
  Users,
  Shield,
  Star,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-[100px] pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="text-blue-500" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Questions fréquentes
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur GTA6 Community
          </p>
        </div>

        {/* Navigation rapide */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="text-purple-500" size={24} />
              Navigation rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="#compte"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                📱 Compte & Profil
              </Link>
              <Link
                href="#mods"
                className="text-green-400 hover:text-green-300 text-sm"
              >
                🎮 Mods & Téléchargements
              </Link>
              <Link
                href="#communaute"
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                👥 Communauté
              </Link>
              <Link
                href="#technique"
                className="text-orange-400 hover:text-orange-300 text-sm"
              >
                🔧 Support technique
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Section Compte & Profil */}
        <div id="compte" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="text-blue-500" size={28} />
            Compte & Profil
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="account-1"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-blue-400 px-6">
                Comment créer un compte ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">
                  Pour créer un compte sur GTA6 Community :
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Cliquez sur "Se connecter" en haut à droite</li>
                  <li>Choisissez "Créer un compte"</li>
                  <li>
                    Remplissez le formulaire avec votre email et mot de passe
                  </li>
                  <li>Confirmez votre email via le lien reçu</li>
                  <li>Complétez votre profil avec un nom d'utilisateur</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="account-2"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-blue-400 px-6">
                Comment modifier mon profil ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">Pour modifier votre profil :</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Connectez-vous à votre compte</li>
                  <li>Cliquez sur votre avatar en haut à droite</li>
                  <li>Sélectionnez "Mon profil"</li>
                  <li>Cliquez sur "Modifier le profil"</li>
                  <li>Mettez à jour vos informations et sauvegardez</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="account-3"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-blue-400 px-6">
                J'ai oublié mon mot de passe, que faire ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">
                  Pas de panique ! Voici comment récupérer votre mot de passe :
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Allez sur la page de connexion</li>
                  <li>Cliquez sur "Mot de passe oublié ?"</li>
                  <li>Entrez votre adresse email</li>
                  <li>Cliquez sur le lien reçu par email</li>
                  <li>Créez un nouveau mot de passe sécurisé</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="account-4"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-blue-400 px-6">
                Comment supprimer mon compte ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">
                  Pour supprimer définitivement votre compte :
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Connectez-vous à votre compte</li>
                  <li>Allez dans "Paramètres du compte"</li>
                  <li>Faites défiler jusqu'à "Supprimer le compte"</li>
                  <li>Confirmez votre choix</li>
                  <li>Note : Cette action est irréversible</li>
                </ul>
                <p className="mt-3 text-sm text-orange-400">
                  ⚠️ Attention : La suppression de votre compte ne supprime pas
                  automatiquement vos mods publiés. Contactez-nous si vous
                  souhaitez les supprimer également.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Section Mods & Téléchargements */}
        <div id="mods" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Download className="text-green-500" size={28} />
            Mods & Téléchargements
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="mods-1"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-green-400 px-6">
                Comment publier un mod ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">
                  Pour publier votre mod sur GTA6 Community :
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Connectez-vous à votre compte</li>
                  <li>Cliquez sur "Publier un mod" dans le menu</li>
                  <li>
                    Remplissez le formulaire avec les informations de votre mod
                  </li>
                  <li>Uploadez les fichiers de votre mod</li>
                  <li>Ajoutez des captures d'écran et une description</li>
                  <li>Soumettez pour modération</li>
                </ol>
                <p className="mt-3 text-sm text-green-400">
                  ✅ Votre mod sera examiné sous 24-48 heures avant publication.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="mods-2"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-green-400 px-6">
                Comment télécharger un mod ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">Pour télécharger un mod :</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Naviguez vers la page du mod qui vous intéresse</li>
                  <li>Lisez la description et les instructions</li>
                  <li>Vérifiez la compatibilité avec votre version du jeu</li>
                  <li>Cliquez sur le bouton "Télécharger"</li>
                  <li>Suivez les instructions d'installation fournies</li>
                </ol>
                <p className="mt-3 text-sm text-blue-400">
                  💡 Conseil : Lisez toujours les commentaires pour voir les
                  retours d'autres utilisateurs.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="mods-3"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-green-400 px-6">
                Quels formats de fichiers sont acceptés ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">Formats acceptés pour les mods :</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">
                      Archives
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>.zip (recommandé)</li>
                      <li>.rar</li>
                      <li>.7z</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">
                      Images
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>.jpg / .jpeg</li>
                      <li>.png</li>
                      <li>.gif</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-3 text-sm text-orange-400">
                  ⚠️ Taille maximale : 100 MB par fichier. Contactez-nous pour
                  les fichiers plus volumineux.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="mods-4"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-green-400 px-6">
                Comment voter et commenter un mod ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">Pour interagir avec les mods :</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Voter</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Utilisez le système d'étoiles (1-5 étoiles)</li>
                      <li>Votez seulement après avoir testé le mod</li>
                      <li>
                        Vos votes aident la communauté à découvrir les meilleurs
                        mods
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">
                      Commenter
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Laissez des commentaires constructifs</li>
                      <li>Posez des questions si vous avez des doutes</li>
                      <li>Signalez les problèmes rencontrés</li>
                      <li>Remerciez les créateurs pour leur travail</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Section Communauté */}
        <div id="communaute" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="text-purple-500" size={28} />
            Communauté
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="community-1"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-purple-400 px-6">
                Comment signaler un contenu inapproprié ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">Pour signaler un contenu problématique :</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Cliquez sur le bouton "Signaler" sous le contenu</li>
                  <li>Sélectionnez la raison du signalement</li>
                  <li>Ajoutez des détails si nécessaire</li>
                  <li>Soumettez le signalement</li>
                </ol>
                <p className="mt-3 text-sm text-purple-400">
                  🔍 Notre équipe de modération examine chaque signalement sous
                  24-48 heures.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="community-2"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-purple-400 px-6">
                Comment contacter les modérateurs ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">Plusieurs façons de nous contacter :</p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email général :</strong>{" "}
                    <Link
                      href="mailto:moderation@gta6community.com"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      moderation@gta6community.com
                    </Link>
                  </p>
                  <p>
                    <strong>Questions légales :</strong>{" "}
                    <Link
                      href="mailto:legal@gta6community.com"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      legal@gta6community.com
                    </Link>
                  </p>
                  <p>
                    <strong>Support technique :</strong>{" "}
                    <Link
                      href="mailto:support@gta6community.com"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      support@gta6community.com
                    </Link>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="community-3"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-purple-400 px-6">
                Comment devenir modérateur ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">
                  Pour rejoindre notre équipe de modération :
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Avoir un compte actif depuis au moins 6 mois</li>
                  <li>Être respecté dans la communauté</li>
                  <li>Avoir une bonne compréhension des règles</li>
                  <li>Être disponible régulièrement</li>
                  <li>
                    Envoyer une candidature à{" "}
                    <Link
                      href="mailto:moderation@gta6community.com"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      moderation@gta6community.com
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Section Support technique */}
        <div id="technique" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="text-orange-500" size={28} />
            Support technique
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="tech-1"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-orange-400 px-6">
                Le site ne fonctionne pas, que faire ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">
                  Si vous rencontrez des problèmes techniques :
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Videz le cache de votre navigateur</li>
                  <li>Essayez un autre navigateur</li>
                  <li>Vérifiez votre connexion internet</li>
                  <li>Désactivez temporairement les extensions</li>
                  <li>Contactez le support si le problème persiste</li>
                </ol>
                <p className="mt-3 text-sm text-orange-400">
                  🛠️ Notre équipe technique surveille en permanence la stabilité
                  du site.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="tech-2"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-orange-400 px-6">
                Comment signaler un bug ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">
                  Pour signaler un bug ou un problème technique :
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Décrivez précisément le problème</li>
                  <li>Indiquez votre navigateur et système d'exploitation</li>
                  <li>Joignez des captures d'écran si possible</li>
                  <li>Expliquez les étapes pour reproduire le bug</li>
                  <li>
                    Envoyez à{" "}
                    <Link
                      href="mailto:bugs@gta6community.com"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      bugs@gta6community.com
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="tech-3"
              className="bg-gray-900/50 border-gray-800 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:text-orange-400 px-6">
                Le téléchargement échoue, que faire ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-6 pb-6">
                <p className="mb-3">Si un téléchargement échoue :</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Vérifiez votre connexion internet</li>
                  <li>Essayez de télécharger à nouveau</li>
                  <li>Utilisez un autre navigateur</li>
                  <li>Désactivez temporairement votre antivirus</li>
                  <li>Contactez le créateur du mod</li>
                  <li>Signalez le problème à notre équipe</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact et support */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="text-blue-500" size={24} />
              Besoin d'aide supplémentaire ?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Si vous n'avez pas trouvé la réponse à votre question, n'hésitez
              pas à nous contacter :
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">
                  Support général
                </h4>
                <Link
                  href="mailto:support@gta6community.com"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  support@gta6community.com
                </Link>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">
                  Questions techniques
                </h4>
                <Link
                  href="mailto:tech@gta6community.com"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  tech@gta6community.com
                </Link>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm">
                💡 <strong>Conseil :</strong> Avant de nous contacter, vérifiez
                que votre question n'est pas déjà traitée dans cette FAQ ou dans
                nos{" "}
                <Link href="/guidelines" className="underline">
                  directives communautaires
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8 bg-gray-700" />

        {/* Note de fin */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            Cette FAQ est régulièrement mise à jour. Dernière mise à jour :{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>
    </div>
  );
}
