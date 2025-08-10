# Configuration EmailJS pour l'envoi d'emails de confirmation

## Étape 1 : Créer un compte EmailJS

1. Allez sur [EmailJS.com](https://www.emailjs.com/) et créez un compte gratuit
2. Connectez-vous à votre tableau de bord

## Étape 2 : Configurer un service email

1. Dans votre tableau de bord, allez dans "Email Services"
2. Cliquez sur "Add New Service"
3. Choisissez votre fournisseur d'email (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre compte email
5. Notez le **Service ID** généré

## Étape 3 : Créer un template d'email

1. Allez dans "Email Templates"
2. Cliquez sur "Create New Template"
3. Utilisez ce modèle de template :

```html
<h2>Confirmation d'inscription - GTA6 Mods Community</h2>

<p>Bonjour {{to_name}},</p>

<p>Votre code de confirmation pour l'inscription est :</p>

<div
  style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;"
>
  <h1
    style="font-size: 32px; color: #1f2937; margin: 0; font-family: monospace;"
  >
    {{confirmation_code}}
  </h1>
</div>

<p>Ce code expire dans 10 minutes.</p>

<p>Si vous n'avez pas demandé cette inscription, ignorez cet email.</p>

<p>
  Cordialement,<br />
  L'équipe GTA6 Mods Community
</p>
```

4. Sauvegardez le template et notez le **Template ID**

## Étape 4 : Obtenir votre clé publique

1. Dans votre tableau de bord, allez dans "Account" > "API Keys"
2. Copiez votre **Public Key**

## Étape 5 : Configurer l'application

1. Ouvrez le fichier `lib/emailjs.ts`
2. Remplacez les valeurs par défaut par vos vraies informations :

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: "votre_service_id_ici",
  TEMPLATE_ID: "votre_template_id_ici",
  PUBLIC_KEY: "votre_public_key_ici",
};
```

## Étape 6 : Tester l'envoi

1. Redémarrez votre serveur de développement
2. Testez l'inscription avec une vraie adresse email
3. Vérifiez que l'email est bien reçu

## Variables du template

Le template utilise ces variables :

- `{{to_email}}` : L'adresse email du destinataire
- `{{to_name}}` : Le nom d'utilisateur
- `{{confirmation_code}}` : Le code à 4 chiffres
- `{{from_name}}` : Le nom de l'expéditeur

## Limites du plan gratuit

- **100 emails par mois** avec le plan gratuit
- **2 services email** maximum
- **5 templates** maximum

## Dépannage

### L'email n'est pas envoyé

- Vérifiez que votre Service ID, Template ID et Public Key sont corrects
- Vérifiez que votre service email est bien connecté
- Regardez la console du navigateur pour les erreurs

### Erreur "Service not found"

- Vérifiez que votre Service ID est correct
- Assurez-vous que le service est bien activé

### Erreur "Template not found"

- Vérifiez que votre Template ID est correct
- Assurez-vous que le template est bien publié

## Sécurité

⚠️ **Important** : La clé publique EmailJS est visible côté client. Pour une production, considérez :

- Limiter le nombre d'emails par utilisateur
- Ajouter une validation côté serveur
- Utiliser un service backend pour l'envoi d'emails
