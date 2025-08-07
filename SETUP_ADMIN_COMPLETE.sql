-- Configuration complète du profil administrateur
-- ===============================================

-- 1. Vérifier si votre profil existe déjà
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE email = 'compteprodylan09@gmail.com';

-- 2. Si le profil existe, le mettre à jour avec le rôle admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'compteprodylan09@gmail.com';

-- 3. Si aucun profil n'existe, créer automatiquement le profil admin
INSERT INTO public.profiles (id, email, username, role, created_at, updated_at)
SELECT 
    auth_users.id,
    auth_users.email,
    COALESCE(auth_users.raw_user_meta_data->>'username', 'admin'),
    'admin',
    now(),
    now()
FROM auth.users auth_users
WHERE auth_users.email = 'compteprodylan09@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth_users.id
);

-- 4. Vérifier le résultat final
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE email = 'compteprodylan09@gmail.com';

-- 5. Vérifier tous les profils avec le rôle admin
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE role = 'admin';

-- 6. Vérifier que la table a bien toutes les colonnes nécessaires
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
AND column_name IN ('id', 'email', 'username', 'role', 'created_at', 'updated_at')
ORDER BY ordinal_position;
