-- Script pour configurer votre profil administrateur
-- =================================================

-- 1. Vérifier si la table profiles existe et a la bonne structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Vérifier si votre profil existe
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE email = 'compteprodylan09@gmail.com';

-- 3. Si le profil existe, le mettre à jour avec le rôle admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'compteprodylan09@gmail.com';

-- 4. Vérifier le résultat
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE email = 'compteprodylan09@gmail.com';

-- 5. Si aucun profil n'est trouvé, vous devrez créer manuellement votre profil
-- Remplacez 'VOTRE_USER_ID' par votre véritable ID utilisateur (UUID)
-- Vous pouvez le trouver dans la table auth.users ou dans les logs de Supabase

-- Exemple (décommentez et modifiez avec votre vrai UUID) :
-- INSERT INTO public.profiles (id, email, username, role, created_at, updated_at)
-- VALUES ('VOTRE_USER_ID_ICI', 'compteprodylan09@gmail.com', 'admin', 'admin', now(), now());

-- 6. Vérifier tous les profils avec le rôle admin
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE role = 'admin';
