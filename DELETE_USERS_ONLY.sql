-- =====================================================
-- SUPPRESSION DES UTILISATEURS UNIQUEMENT
-- =====================================================
-- ⚠️  ATTENTION : CE SCRIPT SUPPRIME TOUS LES UTILISATEURS MAIS GARDE LE CONTENU
-- ⚠️  Le contenu (mods, posts) restera mais sera orphelin (author_id = NULL potentiel)
-- =====================================================

-- ÉTAPE 1: MISE À JOUR DU CONTENU POUR ÉVITER LES ERREURS DE CONTRAINTES
-- =======================================================================

-- Option A: Supprimer tout le contenu lié aux utilisateurs
-- --------------------------------------------------------
DELETE FROM public.downloads;
DELETE FROM public.votes;
DELETE FROM public.mod_ratings;
DELETE FROM public.mod_favorites;
DELETE FROM public.community_comments;
DELETE FROM public.comments;

-- Option B: Ou rendre le contenu anonyme (décommentez si préféré)
-- ---------------------------------------------------------------
-- UPDATE public.mods SET author_id = NULL;
-- UPDATE public.community_posts SET author_id = NULL;
-- UPDATE public.comments SET author_id = NULL;
-- UPDATE public.community_comments SET author_id = NULL;

-- ÉTAPE 2: SUPPRIMER LES PROFILS UTILISATEURS
-- ===========================================
DELETE FROM public.profiles;
SELECT 'Profils utilisateurs supprimés: ' || ROW_COUNT() AS status;

-- ÉTAPE 3: SUPPRIMER LES UTILISATEURS AUTH
-- ========================================
-- ⚠️  ATTENTION: Cela supprimera aussi votre propre compte admin !
-- ⚠️  Assurez-vous d'avoir un autre moyen d'accéder à la base de données

DELETE FROM auth.users;
SELECT 'Utilisateurs auth supprimés: ' || ROW_COUNT() AS status;

-- ÉTAPE 4: NETTOYER LE STOCKAGE DES AVATARS
-- =========================================
-- Note: Exécutez ceci depuis le dashboard Supabase > Storage > avatars
-- Supprimez tous les fichiers du bucket 'avatars'

-- ÉTAPE 5: VÉRIFICATION
-- =====================
SELECT 
    'profiles' as table_name, COUNT(*) as remaining_records FROM public.profiles
UNION ALL
SELECT 
    'auth.users' as table_name, COUNT(*) as remaining_records FROM auth.users;

-- ÉTAPE 6: VÉRIFICATION DU CONTENU RESTANT
-- ========================================
SELECT 
    'mods' as table_name, COUNT(*) as remaining_records FROM public.mods
UNION ALL
SELECT 
    'community_posts' as table_name, COUNT(*) as remaining_records FROM public.community_posts;

SELECT '✅ Suppression des utilisateurs terminée !' as status;
