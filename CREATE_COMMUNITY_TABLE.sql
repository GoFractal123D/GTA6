-- Création de la table community pour les publications communautaires
-- =================================================================

CREATE TABLE IF NOT EXISTS public.community (
    id BIGSERIAL PRIMARY KEY,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('guide', 'theory', 'rp', 'event')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_community_author_id ON public.community(author_id);
CREATE INDEX IF NOT EXISTS idx_community_type ON public.community(type);
CREATE INDEX IF NOT EXISTS idx_community_created_at ON public.community(created_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_community_updated_at ON public.community;
CREATE TRIGGER update_community_updated_at
    BEFORE UPDATE ON public.community
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
