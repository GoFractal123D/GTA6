-- Script pour définir votre rôle d'administrateur
-- ==============================================

-- IMPORTANT: Remplacez 'VOTRE_EMAIL' par votre véritable email
-- Exemple: WHERE email = 'admin@example.com';

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'compteprodylan09@gmail.com';

-- Vérifier que la mise à jour a fonctionné
SELECT id, username, email, role 
FROM public.profiles 
WHERE email = 'compteprodylan09@gmail.com';

-- Si aucun profil n'est trouvé avec cet email, créer un profil admin
-- Remplacez 'VOTRE_USER_ID' par votre véritable ID utilisateur (UUID)
-- INSERT INTO public.profiles (id, email, username, role, created_at, updated_at)
-- VALUES ('VOTRE_USER_ID', 'compteprodylan09@gmail.com', 'admin', 'admin', now(), now());
