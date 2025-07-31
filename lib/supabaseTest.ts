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
    
    // Test 1: Vérifier que le bucket existe
    console.log("1. Vérification de l'existence du bucket...");
    const { data: bucketList, error: bucketError } = await supabase.storage
      .listBuckets();

    if (bucketError) {
      console.error("Erreur lors de la liste des buckets:", bucketError);
      return { success: false, error: "Impossible de lister les buckets" };
    }

    const communityBucket = bucketList.find(bucket => bucket.name === 'community-uploads');
    if (!communityBucket) {
      console.error("Bucket 'community-uploads' non trouvé");
      return { success: false, error: "Bucket 'community-uploads' non trouvé" };
    }

    console.log("Bucket 'community-uploads' trouvé:", communityBucket);

    // Test 2: Vérifier l'accès au bucket
    console.log("2. Test d'accès au bucket...");
    const { data: files, error: accessError } = await supabase.storage
      .from("community-uploads")
      .list("", { limit: 1 });

    if (accessError) {
      console.error("Erreur d'accès au bucket:", accessError);
      return { success: false, error: "Impossible d'accéder au bucket" };
    }

    console.log("Accès au bucket réussi. Fichiers trouvés:", files?.length || 0);

    // Test 3: Vérifier les permissions
    console.log("3. Test des permissions...");
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

    // Nettoyer le fichier de test
    const { error: deleteError } = await supabase.storage
      .from("community-uploads")
      .remove([testFileName]);

    if (deleteError) {
      console.warn("Impossible de supprimer le fichier de test:", deleteError);
    } else {
      console.log("Fichier de test supprimé");
    }

    console.log("Tous les tests de storage sont passés avec succès");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du test de storage:", error);
    return { success: false, error: "Erreur inattendue lors du test de storage" };
  }
} 