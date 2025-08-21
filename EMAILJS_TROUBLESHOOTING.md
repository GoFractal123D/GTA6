# Dépannage EmailJS - Configuration et Résolution d'Erreurs

## 🔧 Configuration EmailJS

### 1. Vérification de la Configuration Actuelle

Les paramètres EmailJS se trouvent dans `lib/emailjs.ts` :

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_uhmp2um',
  TEMPLATE_ID: 'template_x6haubl', 
  PUBLIC_KEY: '5NyviO6Jfs7ErZFQI',
};
```

### 2. Étapes pour Corriger la Configuration

#### A. Vérifier le Service EmailJS
1. Connectez-vous à [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Vérifiez que le service `service_uhmp2um` existe
3. Assurez-vous qu'il est configuré avec un fournisseur d'email valide

#### B. Vérifier le Template
1. Dans EmailJS Dashboard, allez dans "Email Templates"
2. Vérifiez que `template_x6haubl` existe
3. Le template doit contenir ces variables :
   - `{{confirmation_code}}` - Code de confirmation ✅
   - `{{email}}` - Email du destinataire ✅  
   - `{{to_email}}` - Email du destinataire (alias) ✅
   - `{{to_name}}` - Nom du destinataire (optionnel)
   - `{{from_name}}` - Nom de l'expéditeur (optionnel)

#### C. Vérifier la Clé Publique
1. Dans EmailJS Dashboard, allez dans "Account" > "General"
2. Copiez votre "Public Key"
3. Remplacez `5NyviO6Jfs7ErZFQI` par votre vraie clé

### 3. Template EmailJS Recommandé

```html
Subject: Code de confirmation - GTA6 Mods Community

Bonjour,

Votre code de confirmation pour {{email}} est : {{confirmation_code}}

Ce code expire dans 10 minutes.

Cordialement,
L'équipe GTA6 Mods Community
```

## 🐛 Résolution des Erreurs Communes

### Erreur: `{}`
**Cause :** Configuration EmailJS incorrecte ou clés invalides
**Solution :** Vérifier et mettre à jour la configuration

### Erreur: `EmailJS n'est pas disponible`
**Cause :** Library EmailJS non chargée
**Solution :** Vérifier l'import et l'installation : `npm install @emailjs/browser`

### Erreur: `Configuration EmailJS incomplète`
**Cause :** Une ou plusieurs clés manquantes
**Solution :** Compléter toutes les clés dans `EMAILJS_CONFIG`

## 🔄 Mode Fallback (Développement)

En cas d'échec d'EmailJS, le système utilise automatiquement un mode fallback qui :

1. **Simule l'envoi** d'email
2. **Affiche le code** dans la console du navigateur
3. **Stocke le code** dans localStorage pour debug
4. **Permet de continuer** le processus d'inscription

### Comment utiliser le mode fallback :

1. Ouvrez la console du navigateur (F12)
2. Lors de l'inscription, regardez les logs :
   ```
   🔄 Mode fallback EmailJS activé
   📧 Email simulé pour: user@example.com
   🔢 Code de confirmation: 1234
   ```
3. Utilisez le code affiché pour valider l'inscription

## 🧪 Tests

### Test de la Configuration
1. Ouvrez la console du navigateur
2. Tentez une inscription
3. Vérifiez les logs détaillés :
   - ✅ Configuration valide
   - 📧 Tentative d'envoi
   - ✅ Succès ou 🔄 Fallback activé

### Logs de Diagnostic
Le système affiche maintenant des logs détaillés :
- Configuration utilisée
- Paramètres du template
- Détails des erreurs
- État du fallback

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs de la console
2. Testez la configuration EmailJS directement sur leur site
3. Vérifiez que votre quota EmailJS n'est pas dépassé
4. En dernier recours, utilisez le mode fallback pour continuer le développement
