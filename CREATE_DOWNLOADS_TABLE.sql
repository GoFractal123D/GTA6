-- Création de la table downloads
-- ==============================

CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mod_id BIGINT REFERENCES public.mods(id) ON DELETE CASCADE,
    file_name TEXT,
    file_path TEXT,
    file_size BIGINT,
    download_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_mod_id ON public.downloads(mod_id);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON public.downloads(created_at);

-- Politiques RLS pour la table downloads
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Permettre à tous les utilisateurs authentifiés de voir les téléchargements
CREATE POLICY "Downloads are viewable by everyone" ON public.downloads
    FOR SELECT USING (true);

-- Permettre aux utilisateurs authentifiés d'insérer leurs propres téléchargements
CREATE POLICY "Users can insert their own downloads" ON public.downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres téléchargements
CREATE POLICY "Users can update their own downloads" ON public.downloads
    FOR UPDATE USING (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres téléchargements
CREATE POLICY "Users can delete their own downloads" ON public.downloads
    FOR DELETE USING (auth.uid() = user_id);
