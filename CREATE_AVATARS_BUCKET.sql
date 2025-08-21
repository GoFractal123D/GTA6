-- Création du bucket avatars pour le stockage des images de profil
-- ================================================================

-- Créer le bucket avatars s'il n'existe pas déjà
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre l'upload d'avatars par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique pour permettre la lecture publique des avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Politique pour permettre la mise à jour de ses propres avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique pour permettre la suppression de ses propres avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
