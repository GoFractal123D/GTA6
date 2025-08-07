-- Trouver votre ID utilisateur et créer le profil admin
-- ====================================================

-- 1. Trouver votre ID utilisateur dans auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'compteprodylan09@gmail.com';

-- 2. Vérifier si vous avez déjà un profil
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE email = 'compteprodylan09@gmail.com';

-- 3. Si aucun profil n'existe, créer un profil admin
-- Remplacez 'VOTRE_USER_ID' par l'ID trouvé à l'étape 1
-- Exemple avec un UUID fictif (remplacez par le vrai) :
-- INSERT INTO public.profiles (id, email, username, role, created_at, updated_at)
-- VALUES ('12345678-1234-1234-1234-123456789abc', 'compteprodylan09@gmail.com', 'admin', 'admin', now(), now());

-- 4. Alternative : créer le profil avec l'ID trouvé automatiquement
-- Cette requête créera automatiquement votre profil si vous n'en avez pas
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

-- 5. Vérifier le résultat final
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE email = 'compteprodylan09@gmail.com';

-- 6. Vérifier tous les admins
SELECT id, username, email, role, created_at
FROM public.profiles 
WHERE role = 'admin';
