# Configuration Production - VIverse

## 🚨 Variables d'environnement obligatoires pour la production

Pour que le site fonctionne correctement en production, vous devez configurer ces variables d'environnement :

### Variables Supabase (OBLIGATOIRES)

```env
NEXT_PUBLIC_SUPABASE_URL=https://lxazszzgjjwwfifvkfue.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YXpzenpnamp3d2ZpZnZrZnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzA5NDksImV4cCI6MjA2ODcwNjk0OX0.-YmvjXpGanm7Tmh-q9IfYH9Es0Ivp8u319ChRsEMWZA
```

### Variables Email (avec l'adresse Gmail du site)

```env
NEXT_PUBLIC_SITE_EMAIL=compteprodylan09@gmail.com
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key
```

### Variables App

```env
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
NEXT_PUBLIC_APP_NAME=VIverse
```

## 📋 Instructions par plateforme

### Vercel

1. Aller dans votre projet Vercel
2. Settings > Environment Variables
3. Ajouter chaque variable une par une
4. Redéployer le projet

### Netlify

1. Aller dans votre projet Netlify
2. Site settings > Environment variables
3. Ajouter chaque variable une par une
4. Redéployer le projet

### Autres plateformes

Consultez la documentation de votre hébergeur pour ajouter des variables d'environnement.

## 🔧 Fichier .env.local pour le développement local

Créez un fichier `.env.local` à la racine du projet avec :

```env
# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lxazszzgjjwwfifvkfue.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YXpzenpnamp3d2ZpZnZrZnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzA5NDksImV4cCI6MjA2ODcwNjk0OX0.-YmvjXpGanm7Tmh-q9IfYH9Es0Ivp8u319ChRsEMWZA

# Configuration Email
NEXT_PUBLIC_SITE_EMAIL=compteprodylan09@gmail.com

# Configuration App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=VIverse
```

## ✅ Test de la configuration

Après configuration, testez que :

1. Les pages de détail des mods se chargent
2. Les images s'affichent
3. Les téléchargements fonctionnent
4. Aucune erreur de console concernant Supabase

## 🔍 Diagnostic des erreurs

Si vous voyez encore "Variables d'environnement manquantes" :

1. Vérifiez que toutes les variables sont bien configurées
2. Redéployez complètement l'application
3. Vérifiez les logs de déploiement
4. Testez en mode production locale avec `npm run build && npm run start`

## 📞 Support

Si le problème persiste :

- Vérifiez que les variables commencent bien par `NEXT_PUBLIC_`
- Assurez-vous qu'il n'y a pas d'espaces avant/après les valeurs
- Redémarrez complètement le serveur de développement
