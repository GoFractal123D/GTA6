-- Création de la table post pour gérer les interactions (likes, commentaires, partages, sauvegardes)
CREATE TABLE IF NOT EXISTS public.post (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL, -- Référence vers l'ID de la publication (table community)
    action_type TEXT NOT NULL CHECK (action_type IN ('like', 'comment', 'share', 'favorite')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte unique pour éviter les doublons
    UNIQUE(user_id, post_id, action_type)
);

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_post_user_id ON public.post(user_id);
CREATE INDEX IF NOT EXISTS idx_post_post_id ON public.post(post_id);
CREATE INDEX IF NOT EXISTS idx_post_action_type ON public.post(action_type);
CREATE INDEX IF NOT EXISTS idx_post_created_at ON public.post(created_at DESC);

-- Activation de Row Level Security (RLS)
ALTER TABLE public.post ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des interactions
CREATE POLICY "Post interactions are viewable by everyone" ON public.post
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Users can insert their own interactions" ON public.post
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la suppression par l'utilisateur
CREATE POLICY "Users can delete their own interactions" ON public.post
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour obtenir le nombre de likes d'une publication
CREATE OR REPLACE FUNCTION get_post_likes(post_id_param BIGINT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM public.post 
        WHERE post_id = post_id_param AND action_type = 'like'
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le nombre de commentaires d'une publication
CREATE OR REPLACE FUNCTION get_post_comments(post_id_param BIGINT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM public.post 
        WHERE post_id = post_id_param AND action_type = 'comment'
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le nombre de partages d'une publication
CREATE OR REPLACE FUNCTION get_post_shares(post_id_param BIGINT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM public.post 
        WHERE post_id = post_id_param AND action_type = 'share'
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si un utilisateur a liké une publication
CREATE OR REPLACE FUNCTION has_user_liked(user_id_param UUID, post_id_param BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.post 
        WHERE user_id = user_id_param AND post_id = post_id_param AND action_type = 'like'
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si un utilisateur a mis en favori une publication
CREATE OR REPLACE FUNCTION has_user_favorited(user_id_param UUID, post_id_param BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.post 
        WHERE user_id = user_id_param AND post_id = post_id_param AND action_type = 'favorite'
    );
END;
$$ LANGUAGE plpgsql; 