"use client";
import {
  Users,
  Heart,
  AlertTriangle,
  Shield,
  MessageSquare,
  Flag,
  Ban,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-[100px] pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Users className="text-blue-500" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Directives communautaires
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Notre code de conduite pour une communauté respectueuse et
            bienveillante
          </p>
          <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-green-300 text-sm">
              🤝 Ces directives s'inspirent des meilleures pratiques de Reddit,
              Discord et Twitch pour créer un environnement sain et accueillant.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="text-pink-500" size={24} />
              Notre vision de la communauté
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              GTA6 Community est plus qu'une simple plateforme de partage de
              mods. C'est un espace où les passionnés se rencontrent, partagent
              leurs créations et construisent ensemble une communauté forte et
              respectueuse.
            </p>
            <p>
              Ces directives ne sont pas des règles rigides, mais des principes
              qui nous aident à maintenir un environnement où chacun peut
              s'épanouir et contribuer positivement.
            </p>
          </CardContent>
        </Card>

        {/* Comportements attendus */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="text-green-500" size={24} />
              Comportements attendus
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-400">
                  Respect et bienveillance
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Traitement respectueux de tous les membres</li>
                  <li>Écoute active et ouverture d'esprit</li>
                  <li>Critiques constructives et bienveillantes</li>
                  <li>Respect des différences et opinions</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-400">
                  Entraide et partage
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Aide aux nouveaux membres</li>
                  <li>Partage de connaissances et conseils</li>
                  <li>Encouragement des créateurs</li>
                  <li>Collaboration et échanges positifs</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-green-400">
                Qualité et créativité
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Partage de contenu original et de qualité</li>
                <li>Respect des droits d'auteur et licences</li>
                <li>Documentation claire des mods</li>
                <li>Test et validation avant publication</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contenus interdits */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Ban className="text-red-500" size={24} />
              Contenus interdits
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-red-400">Contenu illégal</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Mods contenant du contenu piraté</li>
                  <li>Logiciels malveillants ou cheats</li>
                  <li>Violation de droits d'auteur</li>
                  <li>Contenu pédopornographique</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-red-400">
                  Contenu inapproprié
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Contenu NSFW non marqué</li>
                  <li>Violence graphique excessive</li>
                  <li>Discours haineux ou discriminatoire</li>
                  <li>Harcèlement ou intimidation</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-400">
                Comportements toxiques
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Spam ou publicité non autorisée</li>
                <li>Trolling ou comportement disruptif</li>
                <li>Usurpation d'identité</li>
                <li>Partage d'informations personnelles</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Règles spécifiques aux mods */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="text-blue-500" size={24} />
              Règles spécifiques aux mods
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">
                  Qualité et sécurité
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Les mods doivent être testés et fonctionnels</li>
                  <li>Aucun virus ou logiciel malveillant</li>
                  <li>Documentation claire et instructions d'installation</li>
                  <li>Compatibilité avec les versions du jeu</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">
                  Droits d'auteur
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Respect des licences des assets utilisés</li>
                  <li>Attribution appropriée des créateurs</li>
                  <li>Pas de contenu protégé par copyright</li>
                  <li>Licence claire pour votre mod</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">
                  Description et métadonnées
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Description claire et honnête</li>
                  <li>Captures d'écran représentatives</li>
                  <li>Tags appropriés et pertinents</li>
                  <li>Informations de compatibilité</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Système de modération */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={24} />
              Système de modération
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">
                  Niveaux de sanction
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                    <div>
                      <span className="font-semibold text-yellow-400">
                        Avertissement
                      </span>
                      <p className="text-sm text-gray-400">
                        Premier manquement - explication des règles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                    <div>
                      <span className="font-semibold text-orange-400">
                        Suspension temporaire
                      </span>
                      <p className="text-sm text-gray-400">
                        1 à 30 jours selon la gravité
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                    <div>
                      <span className="font-semibold text-red-400">
                        Bannissement permanent
                      </span>
                      <p className="text-sm text-gray-400">
                        Violations graves ou répétées
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">
                  Rôle des modérateurs
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Surveillance proactive du contenu</li>
                  <li>Application équitable des règles</li>
                  <li>Réponse aux signalements</li>
                  <li>Médiation en cas de conflit</li>
                  <li>Amélioration continue des directives</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Procédure de signalement */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Flag className="text-purple-500" size={24} />
              Procédure de signalement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">
                  Comment signaler un contenu ?
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Cliquez sur le bouton "Signaler" sous le contenu concerné
                  </li>
                  <li>Sélectionnez la raison du signalement</li>
                  <li>Ajoutez des détails si nécessaire</li>
                  <li>Soumettez le signalement</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">
                  Types de signalements
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    <strong>Contenu inapproprié :</strong> Violence, NSFW, haine
                  </li>
                  <li>
                    <strong>Violation de droits d'auteur :</strong> Contenu
                    piraté
                  </li>
                  <li>
                    <strong>Spam :</strong> Publicité non autorisée
                  </li>
                  <li>
                    <strong>Harcèlement :</strong> Comportement toxique
                  </li>
                  <li>
                    <strong>Autre :</strong> Problème non listé
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">
                  Traitement des signalements
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Examen sous 24-48 heures</li>
                  <li>Action appropriée selon la gravité</li>
                  <li>Notification au modérateur si nécessaire</li>
                  <li>Confidentialité des signalements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication et feedback */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="text-green-500" size={24} />
              Communication et feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">
                  Channels de communication
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    <strong>Commentaires :</strong> Discussions constructives
                    sur les mods
                  </li>
                  <li>
                    <strong>Messages privés :</strong> Conversations
                    personnelles
                  </li>
                  <li>
                    <strong>Support :</strong> Questions techniques et aide
                  </li>
                  <li>
                    <strong>Modération :</strong> Questions sur les règles
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">
                  Bonnes pratiques
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Respecter le sujet de la conversation</li>
                  <li>Éviter les discussions hors-sujet</li>
                  <li>Utiliser un langage approprié</li>
                  <li>Être patient avec les nouveaux membres</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact modération */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="text-blue-500" size={24} />
              Contact et questions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Pour toute question concernant ces directives ou pour contacter
              l'équipe de modération :
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">
                  Questions générales
                </h4>
                <Link
                  href="mailto:moderation@gta6community.com"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  moderation@gta6community.com
                </Link>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">
                  Appels de décision
                </h4>
                <Link
                  href="mailto:appeals@gta6community.com"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  appeals@gta6community.com
                </Link>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm">
                💡 <strong>Conseil :</strong> Avant de signaler, essayez de
                résoudre le problème directement avec l'utilisateur concerné de
                manière respectueuse.
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8 bg-gray-700" />

        {/* Note de fin */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            Ces directives évoluent avec notre communauté. Vos suggestions
            d'amélioration sont les bienvenues à{" "}
            <Link
              href="mailto:feedback@gta6community.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              feedback@gta6community.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
