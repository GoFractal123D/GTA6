# Configuration Supabase pour les gros fichiers

## 🚨 Problème

Par défaut, Supabase Storage a une limite de **50MB par fichier**. Pour uploader des images de plus de 1MB, vous devez augmenter cette limite.

## 🔧 Solution

### 1. Accéder au Dashboard Supabase

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Storage** dans le menu de gauche

### 2. Modifier les paramètres de stockage

1. Cliquez sur **Settings** (⚙️)
2. Trouvez la section **File size limits**
3. Augmentez la limite à **200MB** ou plus selon vos besoins
4. Sauvegardez les modifications

### 3. Vérifier les politiques RLS

Assurez-vous que les politiques RLS permettent l'upload :

```sql
-- Politique pour permettre l'upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'community-uploads');
```

### 4. Vérifier les quotas

- **Plan Free** : 1GB de stockage
- **Plan Pro** : 100GB de stockage
- **Plan Team** : 1TB de stockage

## 📊 Limites recommandées

- **Images** : 200MB maximum
- **Vidéos** : 50MB maximum
- **Documents** : 50MB maximum

## 🔍 Test de configuration

Après modification, testez avec un fichier de 2-5MB pour vérifier que la configuration fonctionne.

## 📞 Support

Si vous rencontrez encore des problèmes :

1. Vérifiez les logs dans le dashboard Supabase
2. Contactez le support Supabase
3. Vérifiez votre plan d'abonnement
