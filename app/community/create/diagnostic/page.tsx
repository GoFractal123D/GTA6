"use client";
import { useState, useEffect } from "react";
import { setupDatabase } from "@/lib/database-setup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Database, HardDrive } from "lucide-react";
import Link from "next/link";

export default function DiagnosticPage() {
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const result = await setupDatabase();
      setDiagnostic(result);
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      setDiagnostic({
        table: { success: false, message: 'Erreur lors de la vérification' },
        storage: { success: false, message: 'Erreur lors de la vérification' },
        allReady: false
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Diagnostic en cours...</h1>
            <p className="text-muted-foreground">Vérification de la configuration de la base de données</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/community/create">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              ← Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Diagnostic de la base de données</h1>
            <p className="text-muted-foreground">Vérification de la configuration requise</p>
          </div>
        </div>

        {/* Résumé */}
        <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="w-5 h-5 text-primary" />
              État général
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge 
                variant={diagnostic?.allReady ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {diagnostic?.allReady ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Configuration OK
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Configuration requise
                  </>
                )}
              </Badge>
              <Button onClick={runDiagnostic} variant="outline" size="sm">
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Détails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Table community */}
          <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5 text-blue-500" />
                Table Community
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {diagnostic?.table?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  {diagnostic?.table?.success ? "Disponible" : "Non configurée"}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {diagnostic?.table?.message}
              </p>

              {!diagnostic?.table?.success && diagnostic?.table?.sql && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">SQL à exécuter :</h4>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {diagnostic.table.sql}
                  </pre>
                  <p className="text-xs text-muted-foreground">
                    Exécutez ce SQL dans l'éditeur SQL de votre dashboard Supabase
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Storage bucket */}
          <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HardDrive className="w-5 h-5 text-purple-500" />
                Storage Bucket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {diagnostic?.storage?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  {diagnostic?.storage?.success ? "Disponible" : "Non configuré"}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {diagnostic?.storage?.message}
              </p>

              {!diagnostic?.storage?.success && diagnostic?.storage?.instructions && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Instructions :</h4>
                  <ol className="text-xs text-muted-foreground space-y-1">
                    {diagnostic.storage.instructions.map((instruction: string, index: number) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/community/create">
            <Button variant="outline">
              Retour au formulaire
            </Button>
          </Link>
          <Button onClick={runDiagnostic}>
            Relancer le diagnostic
          </Button>
        </div>

        {/* Informations supplémentaires */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Aide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-500 mb-2">Créer la table Community</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Allez dans votre dashboard Supabase</li>
                  <li>2. Naviguez vers l'éditeur SQL</li>
                  <li>3. Copiez et exécutez le SQL fourni ci-dessus</li>
                  <li>4. Vérifiez que la table a été créée</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-purple-500 mb-2">Créer le bucket Storage</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Allez dans votre dashboard Supabase</li>
                  <li>2. Naviguez vers Storage</li>
                  <li>3. Créez un nouveau bucket "community-uploads"</li>
                  <li>4. Configurez les permissions appropriées</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 