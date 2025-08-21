-- Script pour désactiver la confirmation d'email obligatoire dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Option 1: Désactiver la confirmation d'email dans les paramètres Auth
-- (Recommandé pour le développement)
-- Allez dans Dashboard > Authentication > Settings > Email auth
-- Décochez "Enable email confirmations"

-- Option 2: Fonction pour confirmer automatiquement les emails
-- Cette fonction permet de confirmer un utilisateur par email
CREATE OR REPLACE FUNCTION confirm_user_email(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE auth.users
    SET email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE email = user_email
    AND email_confirmed_at IS NULL;
END;
$$;

-- Option 3: Confirmer tous les utilisateurs non confirmés (ATTENTION: à utiliser avec précaution)
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW(), 
--     updated_at = NOW() 
-- WHERE email_confirmed_at IS NULL;

-- Option 4: Créer une fonction Edge pour la confirmation automatique
-- (Nécessite la création d'une function Supabase Edge Function)

-- Vérifier les utilisateurs non confirmés
SELECT email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL 
ORDER BY created_at DESC;
