-- Création de la table community_comments pour les commentaires des posts communautaires
-- ================================================================================

CREATE TABLE IF NOT EXISTS public.community_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES public.community(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id BIGINT REFERENCES public.community_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON public.community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON public.community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON public.community_comments(created_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_community_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_community_comments_updated_at ON public.community_comments;
CREATE TRIGGER update_community_comments_updated_at
    BEFORE UPDATE ON public.community_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_community_comments_updated_at();
