-- =====================================================
-- CRÉATION DE LA TABLE MOD_FAVORITES
-- =====================================================

-- Créer la table mod_favorites si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.mod_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mod_id UUID NOT NULL, -- Référence à la table mods
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contrainte d'unicité pour éviter les doublons
    UNIQUE(user_id, mod_id)
);

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_mod_favorites_user_id ON public.mod_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_mod_favorites_mod_id ON public.mod_favorites(mod_id);
CREATE INDEX IF NOT EXISTS idx_mod_favorites_created_at ON public.mod_favorites(created_at);

-- =====================================================
-- POLITIQUES RLS
-- =====================================================

-- Activer RLS sur la table mod_favorites
ALTER TABLE public.mod_favorites ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Mod favorites are viewable by everyone" ON public.mod_favorites;
DROP POLICY IF EXISTS "Authenticated users can create favorites" ON public.mod_favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.mod_favorites;

-- Politique pour permettre la lecture de tous les favoris (public)
CREATE POLICY "Mod favorites are viewable by everyone" ON public.mod_favorites
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create favorites" ON public.mod_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la suppression par l'utilisateur qui a créé le favori
CREATE POLICY "Users can delete their own favorites" ON public.mod_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que la table a été créée et compter les enregistrements
SELECT
    'mod_favorites' as table_name,
    COUNT(*) as record_count
FROM public.mod_favorites;

-- Vérifier que RLS est activé
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'mod_favorites'
AND schemaname = 'public';
