-- Politiques RLS pour la table community_comments
-- ===============================================

-- Activer RLS sur la table community_comments
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de tous les commentaires (public)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'community_comments' 
        AND policyname = 'Community comments are viewable by everyone'
    ) THEN
        CREATE POLICY "Community comments are viewable by everyone" ON public.community_comments
            FOR SELECT USING (true);
    END IF;
END $$;

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'community_comments' 
        AND policyname = 'Authenticated users can create community comments'
    ) THEN
        CREATE POLICY "Authenticated users can create community comments" ON public.community_comments
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Politique pour permettre la mise à jour par l'auteur du commentaire
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'community_comments' 
        AND policyname = 'Users can update their own community comments'
    ) THEN
        CREATE POLICY "Users can update their own community comments" ON public.community_comments
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Politique pour permettre la suppression par l'auteur du commentaire
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'community_comments' 
        AND policyname = 'Users can delete their own community comments'
    ) THEN
        CREATE POLICY "Users can delete their own community comments" ON public.community_comments
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
