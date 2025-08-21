import { supabase } from './supabaseClient';

/**
 * Fonction pour confirmer manuellement un utilisateur via l'API
 * Cette fonction utilise les RPC calls pour marquer un email comme confirmé
 */
export const confirmUserEmail = async (email: string): Promise<boolean> => {
  try {
    console.log('🔄 Tentative de confirmation pour:', email);
    
    // Utiliser la fonction SQL personnalisée
    const { data, error } = await supabase.rpc('confirm_user_email', {
      user_email: email
    });

    if (error) {
      console.error('❌ Erreur lors de la confirmation RPC:', error);
      return false;
    }

    console.log('✅ Email confirmé via RPC:', email);
    return true;
  } catch (error) {
    console.error('❌ Erreur dans confirmUserEmail:', error);
    return false;
  }
};

/**
 * Fonction alternative utilisant les policies pour confirmer un utilisateur
 */
export const confirmUserViaUpdate = async (userId: string): Promise<boolean> => {
  try {
    console.log('🔄 Tentative de confirmation pour userId:', userId);
    
    // Cette approche ne fonctionnera que si nous avons les bonnes policies
    const { error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: userId,
          email_confirmed: true,
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('❌ Erreur lors de la confirmation via profiles:', error);
      return false;
    }

    console.log('✅ Utilisateur confirmé via profiles');
    return true;
  } catch (error) {
    console.error('❌ Erreur dans confirmUserViaUpdate:', error);
    return false;
  }
};
