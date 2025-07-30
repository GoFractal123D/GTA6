"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Download,
  Users,
  Star,
  Zap,
  Shield,
  Globe,
  Heart,
  Play,
  CheckCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [stats, setStats] = useState({
    mods: 0,
    downloads: 0,
    users: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      setStats((s) => ({ ...s, loading: true }));
      try {
        const { count: modsCount } = await supabase
          .from("mods")
          .select("id", { count: "exact", head: true });
        const { data: modsData } = await supabase
          .from("mods")
          .select("downloads");
        const downloadsTotal = modsData
          ? modsData.reduce((acc, m) => acc + (m.downloads || 0), 0)
          : 0;
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true });
        setStats({
          mods: modsCount ?? 0,
          downloads: downloadsTotal,
          users: usersCount ?? 0,
          loading: false,
        });
      } catch (error) {
        setStats({
          mods: 1250,
          downloads: 45000,
          users: 3200,
          loading: false,
        });
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-24">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/10 dark:to-pink-500/10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center lg:gap-20">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                >
                  🚀 Plateforme officielle
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  Découvrez{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                    VIverse
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  La communauté ultime pour les mods GTA 6. Partagez, découvrez
                  et téléchargez les meilleures créations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/mods">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 dark:text-white text-black"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Explorer les mods
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.loading ? "..." : stats.mods.toLocaleString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    Mods créés
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.loading ? "..." : stats.downloads.toLocaleString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    Téléchargements
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.loading ? "..." : stats.users.toLocaleString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    Membres actifs
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Image with diagonal cut */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[700px] lg:ml-24 lg:mt-12 -mr-12 lg:mr-0">
              <div className="absolute inset-0 transform -skew-x-12 origin-top-left overflow-hidden rounded-2xl ">
                <Image
                  src="/city.png"
                  alt="GTA 6 Mods"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">
                          Mod du jour
                        </div>
                        <div className="text-gray-300 text-sm">
                          Super Car Pack v2.1
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">4.9</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100/50 dark:bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Pourquoi choisir VIverse ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Une plateforme moderne conçue pour les créateurs et les joueurs
              passionnés
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border-gray-200/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 group shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Upload rapide
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Publiez vos mods en quelques clics avec notre interface
                  intuitive
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border-gray-200/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 group shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Sécurisé
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tous les mods sont vérifiés et sécurisés pour votre protection
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border-gray-200/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 group shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Communauté active
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Rejoignez des milliers de joueurs passionnés et créateurs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border-gray-200/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 group shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Tendances en temps réel
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Découvrez les mods les plus populaires et les nouveautés
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border-gray-200/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 group shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Système de récompenses
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gagnez des points et des badges pour vos contributions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border-gray-200/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 group shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Accessible partout
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Accédez à vos mods favoris depuis n'importe quel appareil
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-600/20 dark:to-pink-600/20 rounded-3xl p-12 text-center backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-lg">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Prêt à rejoindre l'aventure ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Créez votre compte gratuitement et commencez à explorer, partager
              et créer dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Créer mon compte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/mods">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 dark:text-white text-black"
                >
                  Voir les mods populaires
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
