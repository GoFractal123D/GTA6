# Configuration des Emails de Confirmation

## Vue d'ensemble

Ce système utilise un code de confirmation à 4 chiffres au lieu d'un lien de confirmation traditionnel. L'utilisateur reçoit un email avec le code et doit le saisir dans le formulaire pour finaliser son inscription.

## Configuration Actuelle (Développement)

En mode développement, le système :
1. Génère un code à 4 chiffres
2. Affiche le code dans la console (pour les tests)
3. Stocke le code temporairement dans la base de données
4. Simule l'envoi d'email

## Configuration pour la Production

### 1. Service d'Envoi d'Emails

Choisissez un service d'envoi d'emails et ajoutez les variables d'environnement :

```bash
# Exemple avec SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@votresite.com

# Exemple avec Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@votresite.com

# Exemple avec AWS SES
AWS_SES_ACCESS_KEY_ID=your_access_key
AWS_SES_SECRET_ACCESS_KEY=your_secret_key
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@votresite.com
```

### 2. Mise à Jour de l'API Route

Modifiez `app/api/auth/send-confirmation/route.ts` pour utiliser votre service d'email :

```typescript
// Exemple avec SendGrid
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: email,
  from: process.env.SENDGRID_FROM_EMAIL!,
  subject: 'Confirmation d\'inscription GTA 6',
  html: emailContent,
};

await sgMail.send(msg);
```

### 3. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Base de données
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email
EMAIL_SERVICE=sendgrid  # ou 'resend', 'ses'
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=noreply@votresite.com

# Sécurité
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Services d'Email Recommandés

### 1. SendGrid
- **Avantages** : Facile à configurer, bonne délivrabilité
- **Prix** : Gratuit jusqu'à 100 emails/jour
- **Installation** : `npm install @sendgrid/mail`

### 2. Resend
- **Avantages** : API simple, bonne délivrabilité
- **Prix** : Gratuit jusqu'à 100 emails/jour
- **Installation** : `npm install resend`

### 3. AWS SES
- **Avantages** : Très économique, haute fiabilité
- **Prix** : $0.10 pour 1000 emails
- **Installation** : `npm install @aws-sdk/client-ses`

## Sécurité

### 1. Validation des Codes
- Les codes expirent après 10 minutes
- Un seul code actif par email à la fois
- Les codes sont supprimés après utilisation

### 2. Rate Limiting
Ajoutez une protection contre le spam :

```typescript
// Dans l'API route
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 tentatives par fenêtre
};
```

### 3. Validation des Entrées
- Vérification du format email
- Longueur minimale du mot de passe
- Validation du nom d'utilisateur

## Tests

### 1. Test en Développement
```bash
# Vérifier que les codes sont générés
npm run dev
# Aller sur /register et vérifier la console
```

### 2. Test de l'API
```bash
curl -X POST http://localhost:3000/api/auth/send-confirmation \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser"}'
```

## Déploiement

### 1. Vercel
- Ajoutez les variables d'environnement dans le dashboard Vercel
- Les API routes sont automatiquement déployées

### 2. Netlify
- Créez un fichier `netlify.toml` pour les fonctions
- Ajoutez les variables d'environnement dans le dashboard Netlify

### 3. Autres Plateformes
- Assurez-vous que les variables d'environnement sont configurées
- Vérifiez que les API routes sont accessibles

## Monitoring

### 1. Logs
- Surveillez les erreurs d'envoi d'emails
- Vérifiez les tentatives de confirmation échouées

### 2. Métriques
- Taux de succès des confirmations
- Temps de réponse des API
- Nombre d'emails envoyés

## Support

Pour toute question ou problème :
1. Vérifiez les logs de la console
2. Testez l'API avec Postman ou curl
3. Vérifiez la configuration des variables d'environnement
4. Consultez la documentation de votre service d'email
