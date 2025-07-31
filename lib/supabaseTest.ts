import { supabase } from './supabaseClient';

export async function testSupabaseConnection() {
  try {
    console.log("Test de connexion Supabase...");
    
    // Test de la connexion de base
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Erreur de session:", sessionError);
      return false;
    }
    console.log("Session valide:", !!sessionData.session);

    // Test de la table community
    const { data: tableData, error: tableError } = await supabase
      .from("community")
      .select("count")
      .limit(1);

    if (tableError) {
      console.error("Erreur de table community:", tableError);
      return false;
    }
    console.log("Table community accessible");

    // Test du storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("community-uploads")
      .list("", { limit: 1 });

    if (storageError) {
      console.error("Erreur de storage:", storageError);
      return false;
    }
    console.log("Storage accessible");

    console.log("Tous les tests Supabase sont passés avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors du test Supabase:", error);
    return false;
  }
}

export async function testSupabaseStorage() {
  try {
    console.log("Test spécifique du storage Supabase...");
    
    // Test 1: Vérifier l'accès au bucket directement
    console.log("1. Test d'accès au bucket community-uploads...");
    const { data: files, error: accessError } = await supabase.storage
      .from("community-uploads")
      .list("", { limit: 1 });

    if (accessError) {
      console.error("Erreur d'accès au bucket:", accessError);
      return { success: false, error: "Impossible d'accéder au bucket community-uploads" };
    }

    console.log("Accès au bucket réussi. Fichiers trouvés:", files?.length || 0);

    // Test 2: Vérifier les permissions d'upload
    console.log("2. Test des permissions d'upload...");
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = "Test de permissions";
    const testBlob = new Blob([testContent], { type: 'text/plain' });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("community-uploads")
      .upload(testFileName, testBlob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erreur d'upload de test:", uploadError);
      return { success: false, error: "Impossible d'uploader un fichier de test" };
    }

    console.log("Upload de test réussi:", uploadData);

    // Test 3: Vérifier les permissions de suppression
    console.log("3. Test des permissions de suppression...");
    const { error: deleteError } = await supabase.storage
      .from("community-uploads")
      .remove([testFileName]);

    if (deleteError) {
      console.warn("Impossible de supprimer le fichier de test:", deleteError);
      return { success: false, error: "Impossible de supprimer le fichier de test" };
    } else {
      console.log("Fichier de test supprimé avec succès");
    }

    console.log("Tous les tests de storage sont passés avec succès");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du test de storage:", error);
    return { success: false, error: "Erreur inattendue lors du test de storage" };
  }
} 

export async function diagnoseStorageIssue() {
  try {
    console.log("=== Diagnostic du stockage Supabase ===");
    
    // Test 1: Vérifier la configuration Supabase
    console.log("1. Vérification de la configuration Supabase...");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("❌ Erreur de session:", sessionError);
      return { issue: "session", error: sessionError.message };
    }
    console.log("✅ Session valide:", !!sessionData.session);

    // Test 2: Test simple d'accès au bucket
    console.log("2. Test d'accès au bucket community-uploads...");
    try {
      const { data: files, error: accessError } = await supabase.storage
        .from("community-uploads")
        .list("", { limit: 1 });

      if (accessError) {
        console.error("❌ Erreur d'accès au bucket:", accessError);
        return { issue: "bucket_access", error: accessError.message };
      }
      console.log("✅ Accès au bucket réussi");
    } catch (bucketError) {
      console.error("❌ Exception lors de l'accès au bucket:", bucketError);
      return { issue: "bucket_exception", error: (bucketError as Error).message };
    }

    // Test 3: Test d'upload minimal
    console.log("3. Test d'upload minimal...");
    try {
      const testFileName = `diagnostic-${Date.now()}.txt`;
      const testContent = "Test diagnostic";
      const testBlob = new Blob([testContent], { type: 'text/plain' });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("community-uploads")
        .upload(testFileName, testBlob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Erreur d'upload:", uploadError);
        return { issue: "upload", error: uploadError.message };
      }

      console.log("✅ Upload réussi:", uploadData);

      // Nettoyer
      await supabase.storage.from("community-uploads").remove([testFileName]);
      console.log("✅ Fichier de test supprimé");

    } catch (uploadException) {
      console.error("❌ Exception lors de l'upload:", uploadException);
      return { issue: "upload_exception", error: (uploadException as Error).message };
    }

    console.log("✅ Tous les tests de diagnostic sont passés");
    return { issue: "none", error: null };
  } catch (error) {
    console.error("❌ Erreur générale lors du diagnostic:", error);
    return { issue: "general", error: (error as Error).message };
  }
} 