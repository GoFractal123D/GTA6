-- =====================================================
-- SCRIPT DE SUPPRESSION COMPLÈTE - UTILISATEURS ET CONTENU
-- =====================================================
-- ⚠️  ATTENTION : CE SCRIPT SUPPRIME DÉFINITIVEMENT TOUTES LES DONNÉES
-- ⚠️  FAITES UNE SAUVEGARDE AVANT D'EXÉCUTER CE SCRIPT
-- =====================================================

-- ÉTAPE 1: DÉSACTIVER LES CONTRAINTES TEMPORAIREMENT
-- ==================================================
SET session_replication_role = replica;

-- ÉTAPE 2: SUPPRIMER LE CONTENU DES UTILISATEURS
-- ==============================================

-- Supprimer tous les téléchargements
WITH deleted AS (DELETE FROM public.downloads RETURNING *)
SELECT 'Downloads supprimés: ' || COUNT(*) AS status FROM deleted;

-- Supprimer tous les codes de confirmation
WITH deleted AS (DELETE FROM public.confirmation_codes RETURNING *)
SELECT 'Codes de confirmation supprimés: ' || COUNT(*) AS status FROM deleted;

-- Supprimer toutes les notes de mods
WITH deleted AS (DELETE FROM public.mod_ratings RETURNING *)
SELECT 'Notes de mods supprimées: ' || COUNT(*) AS status FROM deleted;

-- Note: Table mod_favorites non trouvée dans votre base, on passe cette étape

-- Supprimer tous les commentaires communautaires
WITH deleted AS (DELETE FROM public.community_comments RETURNING *)
SELECT 'Commentaires communautaires supprimés: ' || COUNT(*) AS status FROM deleted;

-- Supprimer tous les commentaires de mods
WITH deleted AS (DELETE FROM public.comments RETURNING *)
SELECT 'Commentaires de mods supprimés: ' || COUNT(*) AS status FROM deleted;

-- Supprimer tous les posts communautaires
WITH deleted AS (DELETE FROM public.community RETURNING *)
SELECT 'Posts communautaires (community) supprimés: ' || COUNT(*) AS status FROM deleted;

-- Supprimer tous les posts (table post)
WITH deleted AS (DELETE FROM public.post RETURNING *)
SELECT 'Posts supprimés: ' || COUNT(*) AS status FROM deleted;

-- Supprimer tous les mods
WITH deleted AS (DELETE FROM public.mods RETURNING *)
SELECT 'Mods supprimés: ' || COUNT(*) AS status FROM deleted;

-- ÉTAPE 3: SUPPRIMER LES PROFILS UTILISATEURS
-- ===========================================

-- Supprimer tous les profils utilisateurs
WITH deleted AS (DELETE FROM public.profiles RETURNING *)
SELECT 'Profils utilisateurs supprimés: ' || COUNT(*) AS status FROM deleted;

-- ÉTAPE 4: SUPPRIMER LES UTILISATEURS AUTH (OPTIONNEL - DÉCOMMENTEZ SI NÉCESSAIRE)
-- ================================================================================
-- ⚠️  ATTENTION: Cela supprimera aussi votre propre compte admin !
-- ⚠️  Décommentez seulement si vous voulez VRAIMENT tout supprimer

-- WITH deleted AS (DELETE FROM auth.users RETURNING *)
-- SELECT 'Utilisateurs auth supprimés: ' || COUNT(*) AS status FROM deleted;

-- ÉTAPE 5: NETTOYER LE STOCKAGE SUPABASE
-- ======================================
-- Note: Ces commandes doivent être exécutées depuis le dashboard Supabase
-- ou via l'API Storage, pas via SQL

-- Pour nettoyer le stockage, allez dans le dashboard Supabase > Storage et :
--
-- 1. Bucket 'avatars' : Supprimer tous les fichiers
-- 2. Bucket 'mods-images' : Supprimer tous les fichiers  
-- 3. Bucket 'mods-files' : Supprimer tous les fichiers
-- 4. Bucket 'community-uploads' : Supprimer tous les fichiers
--
-- Ou utilisez l'API Storage :
-- DELETE /storage/v1/object/{bucket_name}/*

-- ÉTAPE 6: RÉACTIVER LES CONTRAINTES
-- ==================================
SET session_replication_role = DEFAULT;

-- ÉTAPE 7: REMETTRE À ZÉRO LES SÉQUENCES
-- ======================================
-- Remet à zéro les compteurs auto-increment si nécessaire

-- ÉTAPE 8: VÉRIFICATION
-- =====================
SELECT 
    'mods' as table_name, COUNT(*) as remaining_records FROM public.mods
UNION ALL
SELECT 
    'profiles' as table_name, COUNT(*) as remaining_records FROM public.profiles
UNION ALL
SELECT 
    'comments' as table_name, COUNT(*) as remaining_records FROM public.comments
UNION ALL
SELECT 
    'community' as table_name, COUNT(*) as remaining_records FROM public.community
UNION ALL
SELECT 
    'community_comments' as table_name, COUNT(*) as remaining_records FROM public.community_comments
UNION ALL
SELECT 
    'post' as table_name, COUNT(*) as remaining_records FROM public.post
UNION ALL
SELECT 
    'mod_ratings' as table_name, COUNT(*) as remaining_records FROM public.mod_ratings
UNION ALL
SELECT 
    'downloads' as table_name, COUNT(*) as remaining_records FROM public.downloads
UNION ALL
SELECT 
    'confirmation_codes' as table_name, COUNT(*) as remaining_records FROM public.confirmation_codes;

-- =====================================================
-- RÉSULTAT ATTENDU
-- =====================================================
-- Toutes les tables devraient afficher 0 remaining_records
-- sauf auth.users si vous n'avez pas décommenté la suppression

SELECT '✅ Nettoyage terminé ! Toutes les données utilisateurs et contenu supprimées.' as status;
