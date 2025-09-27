-- =====================================================
-- SUPPRESSION DU CONTENU UNIQUEMENT (GARDER LES UTILISATEURS)
-- =====================================================
-- ⚠️  ATTENTION : CE SCRIPT SUPPRIME TOUT LE CONTENU MAIS GARDE LES UTILISATEURS
-- ⚠️  Les utilisateurs pourront toujours se connecter mais n'auront plus de contenu
-- =====================================================

-- ÉTAPE 1: SUPPRIMER LES INTERACTIONS
-- ===================================

-- Supprimer tous les téléchargements
DELETE FROM public.downloads;
SELECT 'Downloads supprimés: ' || ROW_COUNT() AS status;

-- Supprimer tous les votes
DELETE FROM public.votes WHERE true;
SELECT 'Votes supprimés: ' || ROW_COUNT() AS status;

-- Supprimer toutes les notes de mods
DELETE FROM public.mod_ratings;
SELECT 'Notes de mods supprimées: ' || ROW_COUNT() AS status;

-- Supprimer tous les favoris
DELETE FROM public.mod_favorites;
SELECT 'Favoris supprimés: ' || ROW_COUNT() AS status;

-- ÉTAPE 2: SUPPRIMER LES COMMENTAIRES
-- ===================================

-- Supprimer tous les commentaires communautaires
DELETE FROM public.community_comments;
SELECT 'Commentaires communautaires supprimés: ' || ROW_COUNT() AS status;

-- Supprimer tous les commentaires de mods
DELETE FROM public.comments;
SELECT 'Commentaires de mods supprimés: ' || ROW_COUNT() AS status;

-- ÉTAPE 3: SUPPRIMER LE CONTENU PRINCIPAL
-- =======================================

-- Supprimer tous les posts communautaires
DELETE FROM public.community_posts;
SELECT 'Posts communautaires supprimés: ' || ROW_COUNT() AS status;

-- Supprimer toute la table community (si elle existe)
DELETE FROM public.community;
SELECT 'Contenu community supprimé: ' || ROW_COUNT() AS status;

-- Supprimer tous les posts (si la table existe)
DELETE FROM public.post;
SELECT 'Posts supprimés: ' || ROW_COUNT() AS status;

-- Supprimer tous les mods
DELETE FROM public.mods;
SELECT 'Mods supprimés: ' || ROW_COUNT() AS status;

-- ÉTAPE 4: NETTOYER LE STOCKAGE DU CONTENU
-- ========================================
-- Note: Ces actions doivent être faites depuis le dashboard Supabase > Storage

/*
Pour nettoyer le stockage du contenu :

1. Bucket 'mods-images' : Supprimer tous les fichiers
2. Bucket 'mods-files' : Supprimer tous les fichiers  
3. Bucket 'community-uploads' : Supprimer tous les fichiers

GARDER le bucket 'avatars' car les utilisateurs restent !
*/

-- ÉTAPE 5: VÉRIFICATION DU CONTENU
-- ================================
SELECT 
    'mods' as table_name, COUNT(*) as remaining_records FROM public.mods
UNION ALL
SELECT 
    'comments' as table_name, COUNT(*) as remaining_records FROM public.comments
UNION ALL
SELECT 
    'community_posts' as table_name, COUNT(*) as remaining_records FROM public.community_posts
UNION ALL
SELECT 
    'community_comments' as table_name, COUNT(*) as remaining_records FROM public.community_comments
UNION ALL
SELECT 
    'mod_ratings' as table_name, COUNT(*) as remaining_records FROM public.mod_ratings
UNION ALL
SELECT 
    'mod_favorites' as table_name, COUNT(*) as remaining_records FROM public.mod_favorites
UNION ALL
SELECT 
    'downloads' as table_name, COUNT(*) as remaining_records FROM public.downloads;

-- ÉTAPE 6: VÉRIFICATION DES UTILISATEURS (DOIVENT RESTER)
-- =======================================================
SELECT 
    'profiles' as table_name, COUNT(*) as remaining_records FROM public.profiles
UNION ALL
SELECT 
    'auth.users' as table_name, COUNT(*) as remaining_records FROM auth.users;

SELECT '✅ Suppression du contenu terminée ! Utilisateurs préservés.' as status;
