-- Script pour confirmer un email spécifique dans Supabase
-- À exécuter dans l'SQL Editor de votre Dashboard Supabase

-- 1. D'abord, vérifiez l'état actuel de votre compte
SELECT 
    id,
    email, 
    created_at, 
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN '❌ Non confirmé'
        ELSE '✅ Confirmé'
    END as status
FROM auth.users 
WHERE email = 'blackwidoo946@gmail.com'  -- Remplacez par votre vraie adresse email
ORDER BY created_at DESC;

-- 2. Confirmer votre email spécifique
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'blackwidoo946@gmail.com'  -- Remplacez par votre vraie adresse email
AND email_confirmed_at IS NULL;

-- 3. Vérifier que la confirmation a fonctionné
SELECT 
    id,
    email, 
    created_at, 
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN '❌ Non confirmé'
        ELSE '✅ Confirmé'
    END as status
FROM auth.users 
WHERE email = 'blackwidoo946@gmail.com'  -- Remplacez par votre vraie adresse email
ORDER BY created_at DESC;

-- 4. (Optionnel) Voir tous les utilisateurs non confirmés
SELECT 
    email, 
    created_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN '❌ Non confirmé'
        ELSE '✅ Confirmé'
    END as status
FROM auth.users 
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;
