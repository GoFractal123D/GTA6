"use client";
import { Shield, Database, Eye, Lock, Mail, Trash2, Download, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-[100px] pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="text-blue-500" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-300 text-sm">
              🔒 Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) 
              et s'applique à tous les utilisateurs européens.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="text-blue-500" size={24} />
              Notre engagement en matière de confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Chez GTA6 Community, nous respectons votre vie privée et nous nous engageons à protéger 
              vos données personnelles. Cette politique explique comment nous collectons, utilisons 
              et protégeons vos informations.
            </p>
            <p>
              En utilisant notre plateforme, vous acceptez les pratiques décrites dans cette politique 
              de confidentialité.
            </p>
          </CardContent>
        </Card>

        {/* Données collectées */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="text-green-500" size={24} />
              Quelles données collectons-nous ?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-400">Données d'identification</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Adresse email</li>
                  <li>Nom d'utilisateur</li>
                  <li>Avatar de profil</li>
                  <li>Date de création du compte</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-400">Données techniques</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Système d'exploitation</li>
                  <li>Données de navigation</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-green-400">Contenu utilisateur</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Mods publiés et leurs métadonnées</li>
                <li>Commentaires et avis</li>
                <li>Votes et évaluations</li>
                <li>Messages privés (si applicable)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Pourquoi nous collectons ces données */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="text-purple-500" size={24} />
              Pourquoi collectons-nous ces données ?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-400">Fonctionnalités essentielles</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Création et gestion de compte</li>
                  <li>Publication et partage de mods</li>
                  <li>Système de vote et commentaires</li>
                  <li>Communication entre utilisateurs</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-400">Amélioration du service</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Analyses de performance</li>
                  <li>Détection et prévention de fraudes</li>
                  <li>Optimisation de l'expérience utilisateur</li>
                  <li>Support technique</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accès aux données */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="text-orange-500" size={24} />
              Qui a accès à vos données ?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Notre équipe</h4>
                <p className="text-sm">
                  Seuls les membres autorisés de notre équipe ont accès aux données nécessaires 
                  pour maintenir et améliorer la plateforme.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Services tiers</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Supabase :</strong> Base de données et authentification</li>
                  <li><strong>Vercel :</strong> Hébergement et analytics</li>
                  <li><strong>Google Analytics :</strong> Statistiques de trafic (anonymisées)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Autres utilisateurs</h4>
                <p className="text-sm">
                  Votre nom d'utilisateur et avatar sont visibles par tous les utilisateurs. 
                  Le contenu que vous publiez est accessible selon vos paramètres de confidentialité.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conservation des données */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="text-yellow-500" size={24} />
              Combien de temps conservons-nous vos données ?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Données de compte</h4>
                <p className="text-sm">
                  Conservées tant que votre compte est actif. Supprimées 30 jours après la désactivation 
                  ou suppression du compte.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Contenu publié</h4>
                <p className="text-sm">
                  Les mods et commentaires peuvent être conservés plus longtemps pour maintenir 
                  l'intégrité de la communauté, même après suppression du compte.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Données techniques</h4>
                <p className="text-sm">
                  Logs de sécurité : 12 mois. Analytics : 26 mois maximum. 
                  Données anonymisées : conservation illimitée.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vos droits RGPD */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="text-blue-500" size={24} />
              Vos droits (RGPD)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-blue-300 text-sm font-semibold">
                En tant qu'utilisateur européen, vous disposez des droits suivants :
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-400">Droit d'accès</h4>
                <p className="text-sm">Demander une copie de toutes vos données personnelles</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-400">Droit de rectification</h4>
                <p className="text-sm">Corriger ou mettre à jour vos informations</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-400">Droit à l'effacement</h4>
                <p className="text-sm">Demander la suppression de vos données</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-400">Droit à la portabilité</h4>
                <p className="text-sm">Récupérer vos données dans un format structuré</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comment exercer vos droits */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="text-green-500" size={24} />
              Comment exercer vos droits ?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Pour exercer vos droits RGPD ou demander la suppression/modification de vos données :
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Via votre compte</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Modifier vos informations dans les paramètres</li>
                  <li>Supprimer votre compte</li>
                  <li>Exporter vos données</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Par email</h4>
                <p>
                  Contactez-nous à{" "}
                  <Link href="mailto:privacy@gta6community.com" className="text-blue-400 hover:text-blue-300 underline">
                    privacy@gta6community.com
                  </Link>
                </p>
                <p className="mt-2">
                  Nous répondrons dans les 30 jours maximum.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="text-purple-500" size={24} />
              Cookies et technologies similaires
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Cookies essentiels</h4>
                <p className="text-sm">
                  Nécessaires au fonctionnement de la plateforme (authentification, session, sécurité).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Cookies analytiques</h4>
                <p className="text-sm">
                  Nous utilisons Google Analytics pour comprendre l'utilisation de notre site. 
                  Vous pouvez désactiver ces cookies dans vos paramètres de navigateur.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Gestion des cookies</h4>
                <p className="text-sm">
                  Vous pouvez contrôler les cookies via les paramètres de votre navigateur. 
                  Notez que désactiver certains cookies peut affecter le fonctionnement du site.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="text-red-500" size={24} />
              Sécurité de vos données
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-red-400 mb-2">Mesures de protection</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Chiffrement SSL/TLS pour toutes les communications</li>
                  <li>Mots de passe hashés et salés</li>
                  <li>Accès restreint aux données sensibles</li>
                  <li>Surveillance continue de la sécurité</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-400 mb-2">En cas de violation</h4>
                <p className="text-sm">
                  Si nous détectons une violation de sécurité, nous vous informerons dans les 72 heures 
                  et prendrons toutes les mesures nécessaires pour protéger vos données.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="text-blue-500" size={24} />
              Contact et questions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Pour toute question concernant cette politique de confidentialité :
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Délégué à la protection des données</h4>
                <Link href="mailto:dpo@gta6community.com" className="text-blue-400 hover:text-blue-300 underline">
                  dpo@gta6community.com
                </Link>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Questions générales</h4>
                <Link href="mailto:privacy@gta6community.com" className="text-blue-400 hover:text-blue-300 underline">
                  privacy@gta6community.com
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8 bg-gray-700" />

        {/* Note de fin */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            Cette politique de confidentialité peut être mise à jour. 
            Les modifications importantes seront notifiées par email.
          </p>
        </div>
      </div>
    </div>
  );
} 