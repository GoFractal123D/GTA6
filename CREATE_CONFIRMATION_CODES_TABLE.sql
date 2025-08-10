-- Création de la table des codes de confirmation
-- =============================================

CREATE TABLE IF NOT EXISTS public.confirmation_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE,
    is_used BOOLEAN DEFAULT FALSE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_confirmation_codes_email ON public.confirmation_codes(email);
CREATE INDEX IF NOT EXISTS idx_confirmation_codes_code ON public.confirmation_codes(code);
CREATE INDEX IF NOT EXISTS idx_confirmation_codes_expires ON public.confirmation_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_confirmation_codes_email_code ON public.confirmation_codes(email, code);

-- Politiques RLS pour la sécurité
ALTER TABLE public.confirmation_codes ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion de codes de confirmation
CREATE POLICY "Anyone can create confirmation codes" ON public.confirmation_codes
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture des codes de confirmation
CREATE POLICY "Anyone can read confirmation codes" ON public.confirmation_codes
    FOR SELECT USING (true);

-- Politique pour permettre la mise à jour des codes de confirmation
CREATE POLICY "Anyone can update confirmation codes" ON public.confirmation_codes
    FOR UPDATE USING (true);

-- Politique pour permettre la suppression des codes de confirmation
CREATE POLICY "Anyone can delete confirmation codes" ON public.confirmation_codes
    FOR DELETE USING (true);

-- Fonction pour nettoyer automatiquement les codes expirés
CREATE OR REPLACE FUNCTION cleanup_expired_confirmation_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM public.confirmation_codes 
    WHERE expires_at < NOW() OR is_used = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour nettoyer automatiquement les codes expirés
-- (optionnel, peut être exécuté manuellement ou via une tâche cron)
-- SELECT cleanup_expired_confirmation_codes();

-- Vérifier la structure de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'confirmation_codes' 
AND table_schema = 'public'
ORDER BY ordinal_position;
