-- Index de performance pour optimiser les requêtes
-- ===============================================

-- Index pour la table community
CREATE INDEX IF NOT EXISTS idx_community_author_id_created_at ON public.community(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_type_created_at ON public.community(type, created_at DESC);

-- Index pour la table post (interactions)
CREATE INDEX IF NOT EXISTS idx_post_post_id_action_type ON public.post(post_id, action_type);
CREATE INDEX IF NOT EXISTS idx_post_user_id_action_type ON public.post(user_id, action_type);
CREATE INDEX IF NOT EXISTS idx_post_post_id_user_id_action_type ON public.post(post_id, user_id, action_type);

-- Index pour la table community_comments
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id_created_at ON public.community_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON public.community_comments(user_id);

-- Index pour la table profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Index composites pour les jointures fréquentes
CREATE INDEX IF NOT EXISTS idx_community_author_created ON public.community(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_user_post ON public.community_comments(user_id, post_id);

-- Vérifier les index existants
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('community', 'post', 'community_comments', 'profiles')
ORDER BY tablename, indexname;
