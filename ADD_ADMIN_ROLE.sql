-- Ajout du champ role à la table profiles
-- =====================================

-- Ajouter la colonne role à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Créer un index sur le rôle pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Mettre à jour votre profil pour vous donner le rôle d'administrateur
-- Remplacez 'VOTRE_EMAIL' par votre véritable email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'compteprodylan09@gmail.com';

-- Politique RLS pour permettre aux admins de voir tous les profils
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can view all profiles'
    ) THEN
        CREATE POLICY "Admins can view all profiles" ON public.profiles
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            );
    END IF;
END $$;

-- Politique RLS pour permettre aux admins de modifier tous les profils
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can update all profiles'
    ) THEN
        CREATE POLICY "Admins can update all profiles" ON public.profiles
            FOR UPDATE USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            );
    END IF;
END $$;
