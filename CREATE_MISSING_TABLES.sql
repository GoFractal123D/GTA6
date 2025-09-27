-- =====================================================
-- CRÉATION DES TABLES MANQUANTES
-- =====================================================

-- Table mod_favorites
-- ===================

CREATE TABLE IF NOT EXISTS public.mod_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mod_id UUID NOT NULL, -- Référence à la table mods
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contrainte d'unicité pour éviter les doublons
    UNIQUE(user_id, mod_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_mod_favorites_user_id ON public.mod_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_mod_favorites_mod_id ON public.mod_favorites(mod_id);
CREATE INDEX IF NOT EXISTS idx_mod_favorites_created_at ON public.mod_favorites(created_at);

-- Table mod_ratings
-- =================

CREATE TABLE IF NOT EXISTS public.mod_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mod_id UUID NOT NULL, -- Référence à la table mods
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contrainte d'unicité pour éviter les doublons
    UNIQUE(user_id, mod_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_mod_ratings_user_id ON public.mod_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_mod_ratings_mod_id ON public.mod_ratings(mod_id);
CREATE INDEX IF NOT EXISTS idx_mod_ratings_rating ON public.mod_ratings(rating);
CREATE INDEX IF NOT EXISTS idx_mod_ratings_created_at ON public.mod_ratings(created_at);

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_mod_ratings_updated_at ON public.mod_ratings;
CREATE TRIGGER update_mod_ratings_updated_at
    BEFORE UPDATE ON public.mod_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table downloads (si elle n'existe pas déjà)
-- ===========================================

CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mod_id UUID, -- Optionnel, peut être NULL
    file_name TEXT,
    file_url TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_mod_id ON public.downloads(mod_id);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON public.downloads(downloaded_at);

-- =====================================================
-- POLITIQUES RLS POUR LES TABLES CRÉÉES
-- =====================================================

-- Politiques RLS pour mod_favorites
-- ==================================

ALTER TABLE public.mod_favorites ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de tous les favoris (public)
DROP POLICY IF EXISTS "Mod favorites are viewable by everyone" ON public.mod_favorites;
CREATE POLICY "Mod favorites are viewable by everyone" ON public.mod_favorites
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
DROP POLICY IF EXISTS "Authenticated users can create favorites" ON public.mod_favorites;
CREATE POLICY "Authenticated users can create favorites" ON public.mod_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la suppression par l'utilisateur qui a créé le favori
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.mod_favorites;
CREATE POLICY "Users can delete their own favorites" ON public.mod_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour mod_ratings
-- ===============================

ALTER TABLE public.mod_ratings ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de toutes les notes (public)
DROP POLICY IF EXISTS "Mod ratings are viewable by everyone" ON public.mod_ratings;
CREATE POLICY "Mod ratings are viewable by everyone" ON public.mod_ratings
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
DROP POLICY IF EXISTS "Authenticated users can create ratings" ON public.mod_ratings;
CREATE POLICY "Authenticated users can create ratings" ON public.mod_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la mise à jour par l'utilisateur qui a créé la note
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.mod_ratings;
CREATE POLICY "Users can update their own ratings" ON public.mod_ratings
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour permettre la suppression par l'utilisateur qui a créé la note
DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.mod_ratings;
CREATE POLICY "Users can delete their own ratings" ON public.mod_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour downloads
-- =============================

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
DROP POLICY IF EXISTS "Authenticated users can create download records" ON public.downloads;
CREATE POLICY "Authenticated users can create download records" ON public.downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la lecture de ses propres téléchargements
DROP POLICY IF EXISTS "Users can view their own downloads" ON public.downloads;
CREATE POLICY "Users can view their own downloads" ON public.downloads
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- VÉRIFICATIONS
-- =====================================================

-- Vérifier que les tables ont été créées
SELECT
    'mod_favorites' as table_name,
    COUNT(*) as record_count
FROM public.mod_favorites
UNION ALL
SELECT
    'mod_ratings' as table_name,
    COUNT(*) as record_count
FROM public.mod_ratings
UNION ALL
SELECT
    'downloads' as table_name,
    COUNT(*) as record_count
FROM public.downloads;

-- Vérifier que les politiques RLS sont activées
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('mod_favorites', 'mod_ratings', 'downloads')
AND schemaname = 'public';
