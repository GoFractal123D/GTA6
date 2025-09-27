-- =====================================================
-- CRÉATION DE LA TABLE MOD_RATINGS
-- =====================================================

-- Créer la table mod_ratings si elle n'existe pas
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

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_mod_ratings_user_id ON public.mod_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_mod_ratings_mod_id ON public.mod_ratings(mod_id);
CREATE INDEX IF NOT EXISTS idx_mod_ratings_rating ON public.mod_ratings(rating);
CREATE INDEX IF NOT EXISTS idx_mod_ratings_created_at ON public.mod_ratings(created_at);

-- Créer la fonction de mise à jour automatique si elle n'existe pas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_mod_ratings_updated_at ON public.mod_ratings;
CREATE TRIGGER update_mod_ratings_updated_at
    BEFORE UPDATE ON public.mod_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLITIQUES RLS
-- =====================================================

-- Activer RLS sur la table mod_ratings
ALTER TABLE public.mod_ratings ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Mod ratings are viewable by everyone" ON public.mod_ratings;
DROP POLICY IF EXISTS "Authenticated users can create ratings" ON public.mod_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.mod_ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.mod_ratings;

-- Politique pour permettre la lecture de toutes les notes (public)
CREATE POLICY "Mod ratings are viewable by everyone" ON public.mod_ratings
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create ratings" ON public.mod_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la mise à jour par l'utilisateur qui a créé la note
CREATE POLICY "Users can update their own ratings" ON public.mod_ratings
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour permettre la suppression par l'utilisateur qui a créé la note
CREATE POLICY "Users can delete their own ratings" ON public.mod_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que la table a été créée et compter les enregistrements
SELECT
    'mod_ratings' as table_name,
    COUNT(*) as record_count
FROM public.mod_ratings;

-- Vérifier que RLS est activé
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'mod_ratings'
AND schemaname = 'public';
