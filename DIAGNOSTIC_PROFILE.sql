-- Script de diagnostic pour le profil utilisateur
-- ==============================================

-- 1. Vérifier les mods de l'utilisateur
-- Remplacez 'VOTRE_USER_ID' par votre véritable ID utilisateur
SELECT 
    'Mods de l\'utilisateur' as type,
    COUNT(*) as count,
    'mods' as table_name
FROM mods 
WHERE user_id = 'VOTRE_USER_ID'

UNION ALL

-- 2. Vérifier les commentaires de l'utilisateur sur les mods
SELECT 
    'Commentaires sur mods' as type,
    COUNT(*) as count,
    'comments' as table_name
FROM comments 
WHERE user_id = 'VOTRE_USER_ID'

UNION ALL

-- 3. Vérifier les ratings de l'utilisateur sur les mods
SELECT 
    'Ratings sur mods' as type,
    COUNT(*) as count,
    'mod_ratings' as table_name
FROM mod_ratings 
WHERE user_id = 'VOTRE_USER_ID'

UNION ALL

-- 4. Vérifier les téléchargements de l'utilisateur
SELECT 
    'Téléchargements' as type,
    COUNT(*) as count,
    'downloads' as table_name
FROM downloads 
WHERE user_id = 'VOTRE_USER_ID'

UNION ALL

-- 5. Vérifier les téléchargements des mods de l'utilisateur
SELECT 
    'Téléchargements des mods de l\'utilisateur' as type,
    COUNT(*) as count,
    'downloads sur mods' as table_name
FROM downloads d
JOIN mods m ON d.mod_id = m.id
WHERE m.user_id = 'VOTRE_USER_ID';

-- 6. Vérifier les détails des mods de l'utilisateur
SELECT 
    id,
    title,
    version,
    category,
    created_at
FROM mods 
WHERE user_id = 'VOTRE_USER_ID';

-- 7. Vérifier les détails des ratings de l'utilisateur
SELECT 
    id,
    mod_id,
    rating,
    created_at
FROM mod_ratings 
WHERE user_id = 'VOTRE_USER_ID';

-- 8. Vérifier les détails des commentaires de l'utilisateur
SELECT 
    id,
    mod_id,
    content,
    created_at
FROM comments 
WHERE user_id = 'VOTRE_USER_ID';

-- 9. Vérifier les détails des téléchargements de l'utilisateur
SELECT 
    id,
    mod_id,
    file_name,
    created_at
FROM downloads 
WHERE user_id = 'VOTRE_USER_ID';
