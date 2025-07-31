import { supabase } from './supabaseClient';

export async function checkAndCreateCommunityTable() {
  try {
    // Vérifier si la table community existe en essayant de la lire
    const { data, error } = await supabase
      .from('community')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Erreur lors de la vérification de la table community:', error);
      
      // Si l'erreur indique que la table n'existe pas, on peut la créer
      if (error.message.includes('relation "community" does not exist')) {
        console.log('La table community n\'existe pas. Création en cours...');
        
        // Note: Dans un environnement de production, vous devriez utiliser des migrations SQL
        // Ici, nous allons juste afficher les instructions pour créer la table
        
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS community (
            id BIGSERIAL PRIMARY KEY,
            author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            file_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Créer un index sur author_id pour les performances
          CREATE INDEX IF NOT EXISTS idx_community_author_id ON community(author_id);
          
          -- Créer un index sur created_at pour le tri
          CREATE INDEX IF NOT EXISTS idx_community_created_at ON community(created_at DESC);
          
          -- Créer un index sur type pour le filtrage
          CREATE INDEX IF NOT EXISTS idx_community_type ON community(type);
        `;
        
        console.log('SQL pour créer la table community:');
        console.log(createTableSQL);
        
        return {
          success: false,
          message: 'La table community n\'existe pas. Veuillez exécuter le SQL ci-dessus dans votre base de données Supabase.',
          sql: createTableSQL
        };
      }
      
      return {
        success: false,
        message: `Erreur de base de données: ${error.message}`
      };
    }

    console.log('La table community existe et est accessible.');
    return {
      success: true,
      message: 'La table community est prête à être utilisée.'
    };

  } catch (error) {
    console.error('Erreur lors de la vérification de la base de données:', error);
    return {
      success: false,
      message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
}

export async function checkStorageBucket() {
  try {
    // Vérifier si le bucket community-uploads existe
    const { data, error } = await supabase.storage
      .from('community-uploads')
      .list('', { limit: 1 });

    if (error) {
      console.error('Erreur lors de la vérification du bucket storage:', error);
      
      if (error.message.includes('bucket not found')) {
        console.log('Le bucket community-uploads n\'existe pas.');
        return {
          success: false,
          message: 'Le bucket community-uploads n\'existe pas. Veuillez le créer dans votre dashboard Supabase.',
          instructions: [
            '1. Allez dans votre dashboard Supabase',
            '2. Naviguez vers Storage',
            '3. Créez un nouveau bucket nommé "community-uploads"',
            '4. Configurez les permissions appropriées'
          ]
        };
      }
      
      return {
        success: false,
        message: `Erreur de storage: ${error.message}`
      };
    }

    console.log('Le bucket community-uploads existe et est accessible.');
    return {
      success: true,
      message: 'Le bucket community-uploads est prêt à être utilisé.'
    };

  } catch (error) {
    console.error('Erreur lors de la vérification du storage:', error);
    return {
      success: false,
      message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
}

export async function setupDatabase() {
  console.log('Vérification de la configuration de la base de données...');
  
  const tableCheck = await checkAndCreateCommunityTable();
  const storageCheck = await checkStorageBucket();
  
  return {
    table: tableCheck,
    storage: storageCheck,
    allReady: tableCheck.success && storageCheck.success
  };
} 