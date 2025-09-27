# 🗑️ Guide de Suppression - Utilisateurs et Contenu

## ⚠️ AVERTISSEMENT IMPORTANT

**CES SCRIPTS SUPPRIMENT DÉFINITIVEMENT LES DONNÉES !**

- Faites **TOUJOURS** une sauvegarde avant
- Testez sur une base de données de développement d'abord
- Ces actions sont **IRRÉVERSIBLES**

## 📋 Scripts Disponibles

### 1. `BACKUP_BEFORE_DELETE.sql`

**🔄 À EXÉCUTER EN PREMIER**

- Crée des tables de sauvegarde
- Permet la restauration si nécessaire
- **OBLIGATOIRE avant toute suppression**

### 2. `DELETE_ALL_USERS_AND_CONTENT.sql`

**💥 SUPPRESSION TOTALE**

- Supprime **TOUS** les utilisateurs
- Supprime **TOUT** le contenu
- Remet le site à zéro complet
- ⚠️ **Supprime aussi votre compte admin !**

### 3. `DELETE_USERS_ONLY.sql`

**👥 UTILISATEURS UNIQUEMENT**

- Supprime tous les utilisateurs
- Garde le contenu (mais il devient orphelin)
- ⚠️ **Supprime aussi votre compte admin !**

### 4. `DELETE_CONTENT_ONLY.sql`

**📝 CONTENU UNIQUEMENT**

- Supprime mods, posts, commentaires
- **Garde les utilisateurs**
- Ils peuvent toujours se connecter

## 🚀 Procédure Recommandée

### Étape 1: Sauvegarde

```sql
-- Exécutez ce script en premier
\i BACKUP_BEFORE_DELETE.sql
```

### Étape 2: Choisissez votre option

#### Option A: Tout supprimer (remise à zéro complète)

```sql
\i DELETE_ALL_USERS_AND_CONTENT.sql
```

#### Option B: Supprimer seulement les utilisateurs

```sql
\i DELETE_USERS_ONLY.sql
```

#### Option C: Supprimer seulement le contenu

```sql
\i DELETE_CONTENT_ONLY.sql
```

### Étape 3: Nettoyer le stockage Supabase

Allez dans **Dashboard Supabase > Storage** et supprimez :

#### Si vous avez tout supprimé :

- Bucket `avatars` : Tous les fichiers
- Bucket `mods-images` : Tous les fichiers
- Bucket `mods-files` : Tous les fichiers
- Bucket `community-uploads` : Tous les fichiers

#### Si vous avez gardé les utilisateurs :

- Bucket `mods-images` : Tous les fichiers
- Bucket `mods-files` : Tous les fichiers
- Bucket `community-uploads` : Tous les fichiers
- **GARDER** le bucket `avatars`

## 🔄 Restauration des Données

Si vous avez fait une sauvegarde, vous pouvez restaurer :

```sql
-- Restaurer les utilisateurs
INSERT INTO auth.users SELECT * FROM backup_auth_users;
INSERT INTO public.profiles SELECT * FROM backup_profiles;

-- Restaurer le contenu
INSERT INTO public.mods SELECT * FROM backup_mods;
INSERT INTO public.community_posts SELECT * FROM backup_community_posts;

-- Restaurer les interactions
INSERT INTO public.comments SELECT * FROM backup_comments;
INSERT INTO public.mod_ratings SELECT * FROM backup_mod_ratings;
-- etc...
```

## 📊 Tables Concernées

### Tables utilisateurs :

- `auth.users` (authentification Supabase)
- `public.profiles` (profils étendus)

### Tables contenu :

- `public.mods` (modifications)
- `public.community_posts` (posts communautaires)
- `public.community` (ancien format community)
- `public.post` (anciens posts)

### Tables interactions :

- `public.comments` (commentaires mods)
- `public.community_comments` (commentaires community)
- `public.mod_ratings` (notes)
- `public.mod_favorites` (favoris)
- `public.downloads` (historique téléchargements)
- `public.votes` (système de votes)

## 🛡️ Mesures de Sécurité

1. **Toujours sauvegarder** avec `BACKUP_BEFORE_DELETE.sql`
2. **Tester en développement** d'abord
3. **Prévoir un compte admin** de secours
4. **Documenter** ce que vous supprimez
5. **Vérifier** les résultats avec les requêtes de vérification

## 📞 En Cas de Problème

Si quelque chose ne va pas :

1. **Arrêtez** immédiatement l'exécution
2. **Vérifiez** les tables de sauvegarde
3. **Restaurez** depuis les sauvegardes
4. **Contactez** le support si nécessaire

## ✅ Après la Suppression

1. Vérifiez que les compteurs sont à zéro
2. Testez la connexion/inscription
3. Vérifiez que le site fonctionne
4. Supprimez les tables de sauvegarde si tout va bien :
   ```sql
   DROP TABLE IF EXISTS backup_profiles CASCADE;
   DROP TABLE IF EXISTS backup_auth_users CASCADE;
   -- etc...
   ```

---

**💡 Conseil** : Pour un site en production, préférez la suppression par étapes plutôt qu'une suppression massive.
