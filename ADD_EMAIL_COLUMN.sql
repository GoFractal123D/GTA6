-- Ajouter la colonne email à la table profiles existante
-- ===================================================

-- 1. Ajouter la colonne email si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Vérifier la structure actuelle de la table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Mettre à jour les profils existants avec l'email depuis auth.users
UPDATE public.profiles 
SET email = auth_users.email
FROM auth.users auth_users
WHERE public.profiles.id = auth_users.id
AND public.profiles.email IS NULL;

-- 4. Vérifier les profils mis à jour
SELECT id, username, email, role, created_at
FROM public.profiles 
LIMIT 10;

-- 5. Maintenant mettre à jour votre rôle d'admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'compteprodylan09@gmail.com';

-- 6. Vérifier le résultat
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE email = 'compteprodylan09@gmail.com';

-- 7. Si aucun profil n'est trouvé, créer manuellement
-- Remplacez 'VOTRE_USER_ID' par votre véritable ID utilisateur (UUID)
-- INSERT INTO public.profiles (id, email, username, role, created_at, updated_at)
-- VALUES ('VOTRE_USER_ID_ICI', 'compteprodylan09@gmail.com', 'admin', 'admin', now(), now());
