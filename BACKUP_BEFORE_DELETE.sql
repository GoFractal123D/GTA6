-- =====================================================
-- SCRIPT DE SAUVEGARDE AVANT SUPPRESSION
-- =====================================================
-- ⚠️  EXÉCUTEZ CE SCRIPT AVANT TOUTE SUPPRESSION
-- ⚠️  Il créera des tables de sauvegarde pour récupérer les données si nécessaire
-- =====================================================

-- ÉTAPE 1: CRÉER LES TABLES DE SAUVEGARDE
-- =======================================

-- Sauvegarde des utilisateurs
DROP TABLE IF EXISTS backup_profiles CASCADE;
CREATE TABLE backup_profiles AS SELECT * FROM public.profiles;

DROP TABLE IF EXISTS backup_auth_users CASCADE;
CREATE TABLE backup_auth_users AS SELECT * FROM auth.users;

-- Sauvegarde du contenu
DROP TABLE IF EXISTS backup_mods CASCADE;
CREATE TABLE backup_mods AS SELECT * FROM public.mods;

DROP TABLE IF EXISTS backup_comments CASCADE;
CREATE TABLE backup_comments AS SELECT * FROM public.comments;

DROP TABLE IF EXISTS backup_community_posts CASCADE;
CREATE TABLE backup_community_posts AS SELECT * FROM public.community_posts;

DROP TABLE IF EXISTS backup_community_comments CASCADE;
CREATE TABLE backup_community_comments AS SELECT * FROM public.community_comments;

-- Sauvegarde des interactions
DROP TABLE IF EXISTS backup_mod_ratings CASCADE;
CREATE TABLE backup_mod_ratings AS SELECT * FROM public.mod_ratings;

DROP TABLE IF EXISTS backup_mod_favorites CASCADE;
CREATE TABLE backup_mod_favorites AS SELECT * FROM public.mod_favorites;

DROP TABLE IF EXISTS backup_downloads CASCADE;
CREATE TABLE backup_downloads AS SELECT * FROM public.downloads;

DROP TABLE IF EXISTS backup_votes CASCADE;
CREATE TABLE backup_votes AS SELECT * FROM public.votes;

-- Sauvegarde community (si elle existe)
DROP TABLE IF EXISTS backup_community CASCADE;
CREATE TABLE backup_community AS SELECT * FROM public.community;

-- Sauvegarde post (si elle existe)
DROP TABLE IF EXISTS backup_post CASCADE;
CREATE TABLE backup_post AS SELECT * FROM public.post;

-- ÉTAPE 2: VÉRIFICATION DES SAUVEGARDES
-- =====================================

SELECT 
    'backup_profiles' as table_name, COUNT(*) as backed_up_records FROM backup_profiles
UNION ALL
SELECT 
    'backup_auth_users' as table_name, COUNT(*) as backed_up_records FROM backup_auth_users
UNION ALL
SELECT 
    'backup_mods' as table_name, COUNT(*) as backed_up_records FROM backup_mods
UNION ALL
SELECT 
    'backup_comments' as table_name, COUNT(*) as backed_up_records FROM backup_comments
UNION ALL
SELECT 
    'backup_community_posts' as table_name, COUNT(*) as backed_up_records FROM backup_community_posts
UNION ALL
SELECT 
    'backup_community_comments' as table_name, COUNT(*) as backed_up_records FROM backup_community_comments
UNION ALL
SELECT 
    'backup_mod_ratings' as table_name, COUNT(*) as backed_up_records FROM backup_mod_ratings
UNION ALL
SELECT 
    'backup_mod_favorites' as table_name, COUNT(*) as backed_up_records FROM backup_mod_favorites
UNION ALL
SELECT 
    'backup_downloads' as table_name, COUNT(*) as backed_up_records FROM backup_downloads
UNION ALL
SELECT 
    'backup_votes' as table_name, COUNT(*) as backed_up_records FROM backup_votes;

-- ÉTAPE 3: INFORMATIONS IMPORTANTES POUR LA RESTAURATION
-- ======================================================

/*
🔄 POUR RESTAURER LES DONNÉES PLUS TARD :

1. Restaurer les utilisateurs :
   INSERT INTO auth.users SELECT * FROM backup_auth_users;
   INSERT INTO public.profiles SELECT * FROM backup_profiles;

2. Restaurer le contenu :
   INSERT INTO public.mods SELECT * FROM backup_mods;
   INSERT INTO public.community_posts SELECT * FROM backup_community_posts;

3. Restaurer les interactions :
   INSERT INTO public.comments SELECT * FROM backup_comments;
   INSERT INTO public.community_comments SELECT * FROM backup_community_comments;
   INSERT INTO public.mod_ratings SELECT * FROM backup_mod_ratings;
   INSERT INTO public.mod_favorites SELECT * FROM backup_mod_favorites;
   INSERT INTO public.downloads SELECT * FROM backup_downloads;
   INSERT INTO public.votes SELECT * FROM backup_votes;

⚠️  ATTENTION : 
- Vous devrez peut-être désactiver temporairement les triggers
- Vérifiez que les IDs n'entrent pas en conflit
- Testez d'abord sur une base de données de test
*/

-- ÉTAPE 4: TIMESTAMP DE LA SAUVEGARDE
-- ===================================

SELECT 
    'Sauvegarde créée le : ' || NOW()::text as backup_info
UNION ALL
SELECT 
    'Total tables sauvegardées : ' || COUNT(*)::text as backup_info
FROM information_schema.tables 
WHERE table_name LIKE 'backup_%' 
AND table_schema = 'public';

SELECT '✅ Sauvegarde terminée ! Vous pouvez maintenant procéder à la suppression.' as status;
