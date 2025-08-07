-- Vérifier comment les favoris sont stockés
-- ========================================

-- 1. Vérifier la structure de la table post
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'post' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Vérifier les données dans la table post pour votre utilisateur
-- Remplacez 'VOTRE_USER_ID' par votre véritable ID utilisateur
SELECT 
    id,
    user_id,
    post_id,
    mod_id,
    action_type,
    created_at
FROM post 
WHERE user_id = 'VOTRE_USER_ID'
ORDER BY created_at DESC;

-- 3. Vérifier s'il existe une table mod_favorites
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%favorite%'
ORDER BY table_name;

-- 4. Si la table mod_favorites existe, vérifier sa structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'mod_favorites' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Vérifier les ratings de mods pour votre utilisateur
-- Remplacez 'VOTRE_USER_ID' par votre véritable ID utilisateur
SELECT 
    id,
    user_id,
    mod_id,
    rating,
    created_at
FROM mod_ratings 
WHERE user_id = 'VOTRE_USER_ID'
ORDER BY created_at DESC;

-- 6. Vérifier les mods que vous avez notés
-- Remplacez 'VOTRE_USER_ID' par votre véritable ID utilisateur
SELECT 
    m.id,
    m.title,
    m.category,
    m.version,
    mr.rating,
    mr.created_at as rating_date
FROM mods m
JOIN mod_ratings mr ON m.id = mr.mod_id
WHERE mr.user_id = 'VOTRE_USER_ID'
ORDER BY mr.created_at DESC;
