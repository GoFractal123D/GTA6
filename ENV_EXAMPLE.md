# Variables d'Environnement - VIverse

Copiez ce contenu dans un fichier `.env.local` à la racine du projet :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# EmailJS Configuration (pour confirmation utilisateurs)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key

# Analytics (optionnel)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
NEXT_PUBLIC_MAX_IMAGE_SIZE=5242880

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=VIverse
```

## Instructions de Configuration

### 1. Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans Settings > API
3. Copier l'URL et la clé anonyme
4. Exécuter les scripts SQL fournis

### 2. EmailJS

1. Créer un compte sur [emailjs.com](https://emailjs.com)
2. Configurer un service email (Gmail/Outlook)
3. Créer un template de confirmation
4. Copier les IDs dans les variables

### 3. Google Analytics (optionnel)

1. Créer une propriété GA4
2. Copier le Measurement ID

## Variables Détaillées

### Obligatoires

- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé publique Supabase

### Optionnelles

- `SUPABASE_SERVICE_ROLE_KEY` : Pour opérations admin (ne pas exposer côté client)
- `NEXT_PUBLIC_EMAILJS_*` : Configuration emails de confirmation
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` : Tracking Google Analytics
- `NEXT_PUBLIC_MAX_*` : Limites d'upload fichiers
