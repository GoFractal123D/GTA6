-- Politiques RLS pour la table community
-- ======================================

-- Activer RLS sur la table community
ALTER TABLE public.community ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de tous les posts (public)
CREATE POLICY "Community posts are viewable by everyone" ON public.community
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create community posts" ON public.community
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Politique pour permettre la mise à jour par l'auteur du post
CREATE POLICY "Users can update their own community posts" ON public.community
    FOR UPDATE USING (auth.uid() = author_id);

-- Politique pour permettre la suppression par l'auteur du post
CREATE POLICY "Users can delete their own community posts" ON public.community
    FOR DELETE USING (auth.uid() = author_id);

-- Politiques RLS pour la table post (interactions)
-- ===============================================

-- Activer RLS sur la table post
ALTER TABLE public.post ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des interactions (public)
CREATE POLICY "Post interactions are viewable by everyone" ON public.post
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create interactions" ON public.post
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la suppression par l'utilisateur qui a créé l'interaction
CREATE POLICY "Users can delete their own interactions" ON public.post
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour la table mods
-- =================================

-- Activer RLS sur la table mods
ALTER TABLE public.mods ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de tous les mods (public)
CREATE POLICY "Mods are viewable by everyone" ON public.mods
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create mods" ON public.mods
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Politique pour permettre la mise à jour par l'auteur du mod
CREATE POLICY "Users can update their own mods" ON public.mods
    FOR UPDATE USING (auth.uid() = author_id);

-- Politique pour permettre la suppression par l'auteur du mod
CREATE POLICY "Users can delete their own mods" ON public.mods
    FOR DELETE USING (auth.uid() = author_id);

-- Politiques RLS pour la table comments
-- ====================================

-- Activer RLS sur la table comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de tous les commentaires (public)
CREATE POLICY "Comments are viewable by everyone" ON public.comments
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Politique pour permettre la mise à jour par l'auteur du commentaire
CREATE POLICY "Users can update their own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = author_id);

-- Politique pour permettre la suppression par l'auteur du commentaire
CREATE POLICY "Users can delete their own comments" ON public.comments
    FOR DELETE USING (auth.uid() = author_id);

-- Politiques RLS pour la table profiles
-- ====================================

-- Activer RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de tous les profils (public)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par l'utilisateur lui-même
CREATE POLICY "Users can create their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Politique pour permettre la mise à jour par l'utilisateur lui-même
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politique pour permettre la suppression par l'utilisateur lui-même
CREATE POLICY "Users can delete their own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- =================================================================
-- ⚠️ AVERTISSEMENT IMPORTANT
-- =================================================================
-- Les tables suivantes doivent être créées AVANT d'exécuter leurs politiques RLS :
-- - public.mod_ratings (utilisez CREATE_MOD_RATINGS_TABLE.sql)
-- - public.mod_favorites (utilisez CREATE_MOD_FAVORITES_TABLE.sql)
-- - public.downloads (utilisez CREATE_DOWNLOADS_TABLE.sql)
--
-- Si ces tables n'existent pas, les politiques RLS échoueront !
-- =================================================================

-- Politiques RLS pour la table mod_ratings
-- ========================================

-- Activer RLS sur la table mod_ratings
ALTER TABLE public.mod_ratings ENABLE ROW LEVEL SECURITY;

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

-- Politiques RLS pour la table mod_favorites
-- ==========================================

-- Activer RLS sur la table mod_favorites
ALTER TABLE public.mod_favorites ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de tous les favoris (public)
CREATE POLICY "Mod favorites are viewable by everyone" ON public.mod_favorites
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create favorites" ON public.mod_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la suppression par l'utilisateur qui a créé le favori
CREATE POLICY "Users can delete their own favorites" ON public.mod_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour la table downloads
-- ======================================

-- Activer RLS sur la table downloads
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create download records" ON public.downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la lecture de ses propres téléchargements
CREATE POLICY "Users can view their own downloads" ON public.downloads
    FOR SELECT USING (auth.uid() = user_id);

-- Fonction trigger pour créer automatiquement un profil lors de l'inscription
-- ===========================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, created_at, updated_at)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour appeler la fonction lors de l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
