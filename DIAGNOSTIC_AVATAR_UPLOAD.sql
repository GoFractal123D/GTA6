-- Script de diagnostic pour l'upload d'avatars
-- =============================================

-- 1. Vérifier que le bucket avatars existe
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'avatars';

-- 2. Vérifier les politiques RLS sur storage.objects
SELECT polname, polcmd, polroles, qual, with_check
FROM pg_policy 
WHERE polrelid = (
  SELECT oid FROM pg_class WHERE relname = 'objects' 
  AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage')
)
AND polname LIKE '%avatar%';

-- 3. Vérifier si RLS est activé sur storage.objects
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- 4. Vérifier les fichiers existants dans le bucket avatars
SELECT name, bucket_id, created_at, updated_at, last_accessed_at, metadata
FROM storage.objects 
WHERE bucket_id = 'avatars'
ORDER BY created_at DESC
LIMIT 10;

-- 5. Vérifier la table profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 6. Vérifier les politiques RLS sur la table profiles
SELECT polname, polcmd, polroles, qual, with_check
FROM pg_policy 
WHERE polrelid = (
  SELECT oid FROM pg_class WHERE relname = 'profiles' 
  AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
);

-- 7. Test de connexion utilisateur actuel
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role,
  auth.email() as current_email;
