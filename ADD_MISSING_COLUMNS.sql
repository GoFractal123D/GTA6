-- Ajouter toutes les colonnes manquantes à la table profiles
-- ========================================================

-- 1. Ajouter la colonne email si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Ajouter la colonne role si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- 3. Ajouter la colonne avatar_url si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 4. Ajouter la colonne bio si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 5. Ajouter la colonne website si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS website TEXT;

-- 6. Ajouter la colonne location si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- 7. Ajouter la colonne updated_at si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 8. Vérifier la structure actuelle de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 9. Mettre à jour les profils existants avec l'email depuis auth.users
UPDATE public.profiles 
SET email = auth_users.email
FROM auth.users auth_users
WHERE public.profiles.id = auth_users.id
AND public.profiles.email IS NULL;

-- 10. Vérifier les profils mis à jour
SELECT id, username, email, role, created_at
FROM public.profiles 
LIMIT 10;
