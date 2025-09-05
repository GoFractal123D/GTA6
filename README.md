# 🎮 VIverse - Plateforme de Mods GTA 6

> **Plateforme communautaire moderne dédiée aux mods Grand Theft Auto 6**

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Stack technique](#stack-technique)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Déploiement](#déploiement)
- [Structure du projet](#structure-du-projet)
- [Configuration](#configuration)
- [Roadmap](#roadmap)
- [Coûts d'exploitation](#coûts-dexploitation)

## 🎯 Vue d'ensemble

VIverse est une plateforme communautaire complète conçue pour héberger, partager et découvrir des mods pour Grand Theft Auto 6. Développée entièrement par un créateur solo passionné, elle propose une expérience moderne et intuitive pour les joueurs et créateurs de mods.

### 🚀 Points forts

- **Interface moderne** : Design responsive avec Tailwind CSS
- **Performance optimisée** : Next.js 14 avec App Router
- **Système de cache intelligent** : Navigation fluide et rapide
- **Authentification sécurisée** : Supabase Auth avec confirmation email
- **Base de données robuste** : PostgreSQL avec RLS (Row Level Security)
- **SEO-ready** : Optimisé pour les moteurs de recherche

## 🛠 Stack technique

### Frontend

- **Framework** : Next.js 14 (App Router)
- **UI** : React 18 + TypeScript
- **Styling** : Tailwind CSS + Shadcn/ui
- **Icons** : Lucide React
- **Animations** : CSS natives + Framer Motion (optionnel)

### Backend & Base de données

- **BaaS** : Supabase (PostgreSQL + Auth + Storage + Realtime)
- **ORM** : Supabase Client SDK
- **Storage** : Supabase Storage (images, fichiers mods)
- **Auth** : Supabase Auth + EmailJS

### Déploiement & Outils

- **Hosting** : Vercel (optimisé Next.js)
- **Email** : EmailJS (confirmation utilisateurs)
- **Domain** : Custom domain ready
- **Analytics** : Google Analytics (intégrable)

## ✨ Fonctionnalités

### 🔐 Authentification & Utilisateurs

- [x] Inscription avec confirmation email (code à 4 chiffres)
- [x] Connexion sécurisée
- [x] Profils utilisateurs avec avatars
- [x] Système de rôles (User, Admin)

### 📦 Gestion des Mods

- [x] Upload de mods avec fichiers multiples
- [x] Catégories et tags
- [x] Images et captures d'écran
- [x] Descriptions détaillées avec changelog
- [x] Instructions d'installation
- [x] Système de téléchargement

### 🌟 Interaction Communautaire

- [x] Système de commentaires en temps réel
- [x] Vote système (upvote/downvote)
- [x] Pages communautaires
- [x] Posts de discussion
- [x] Modération intégrée

### 🎨 Interface & UX

- [x] Design responsive (mobile-first)
- [x] Mode sombre/clair automatique
- [x] Navigation moderne avec menu mobile
- [x] Cartes de mods avec animations
- [x] Système de pagination
- [x] Recherche et filtres avancés

### 📊 Administration

- [x] Panel admin pour modération
- [x] Gestion des utilisateurs
- [x] Statistiques en temps réel
- [x] Logs et monitoring

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm/pnpm/yarn
- Compte Supabase
- Compte EmailJS (optionnel)

### Étapes

1. **Cloner le repository**

```bash
git clone [REPO_URL]
cd gta6-mods-platform
```

2. **Installer les dépendances**

```bash
npm install
# ou
pnpm install
```

3. **Configuration environnement**

```bash
cp .env.example .env.local
```

4. **Variables d'environnement requises**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS (optionnel)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

5. **Setup base de données**

```bash
# Exécuter les scripts SQL fournis dans l'ordre :
# 1. CREATE_PROFILES_TABLE.sql
# 2. CREATE_POST_TABLE.sql
# 3. CREATE_COMMUNITY_TABLE.sql
# 4. CREATE_COMMUNITY_COMMENTS_TABLE.sql
# 5. CREATE_DOWNLOADS_TABLE.sql
# 6. RLS_POLICIES.sql
```

6. **Lancer en développement**

```bash
npm run dev
```

7. **Accéder à l'application**

```
http://localhost:3000
```

## 🌐 Déploiement

### Vercel (Recommandé)

1. **Connecter à Vercel**

```bash
npm i -g vercel
vercel login
vercel
```

2. **Variables d'environnement**

- Ajouter toutes les variables `.env.local` dans Vercel Dashboard
- Configurer le domaine custom

3. **Build automatique**

- Push sur `main` → déploiement automatique
- Preview branches disponibles

### Alternative : Netlify / Railway

La plateforme est compatible avec d'autres hébergeurs supportant Next.js.

## 📁 Structure du projet

```
├── app/                    # App Router (Next.js 14)
│   ├── (auth)/            # Routes d'authentification
│   ├── mod/[slug]/        # Pages détail des mods
│   ├── mods/              # Listing des mods
│   ├── community/         # Pages communautaires
│   ├── profile/           # Profil utilisateur
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/                # Shadcn/ui components
│   ├── ModernNavigation.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                   # Utilitaires et configurations
│   ├── supabaseClient.ts  # Client Supabase
│   ├── emailjs.ts         # Configuration EmailJS
│   └── utils.ts
├── public/                # Assets statiques
├── styles/                # Styles globaux
└── sql_scripts/           # Scripts de base de données
```

## ⚙️ Configuration

### Supabase Setup

1. Créer un projet Supabase
2. Exécuter les scripts SQL fournis
3. Configurer l'authentification email
4. Setup Storage buckets (avatars, mod-files, mod-images)

### EmailJS Setup

1. Créer un compte EmailJS
2. Configurer un service email (Gmail/Outlook)
3. Créer un template de confirmation
4. Ajouter les clés API

### Domaine Custom

1. Acheter un domaine (.com/.gg recommandé)
2. Configurer DNS vers Vercel
3. SSL automatique via Let's Encrypt

## 🛣 Roadmap

### ✅ Terminé (90%)

- Infrastructure complète (auth, BDD, déploiement)
- Interface utilisateur moderne et responsive
- Système de mods complet (upload, download, métadonnées)
- Commentaires et interaction communautaire
- Administration et modération
- SEO et optimisations performance

### 🚧 En cours / À terminer (10%)

- **Système de notifications** push (WebPush API)
- **API REST** publique pour développeurs
- **Intégration Stripe** pour donations/premium
- **Analytics avancées** (dashboard admin)
- **Recherche full-text** (PostgreSQL FTS)
- **CDN** pour les fichiers volumineux
- **Tests automatisés** (Jest/Cypress)

### 🎯 Améliorations futures

- **Intelligence artificielle** : Recommandations de mods
- **Mobile app** : React Native/Flutter
- **Intégrations gaming** : Discord, Steam
- **Marketplace** : Vente de mods premium
- **API externe** : Intégration avec d'autres plateformes

## 💰 Coûts d'exploitation

### Gratuit jusqu'à :

- **Vercel** : 100GB bandwidth/mois, domaine custom
- **Supabase** : 500MB DB, 1GB storage, 2M requêtes/mois
- **EmailJS** : 200 emails/mois

### Scaling (estimation) :

- **Vercel Pro** : $20/mois (500GB bandwidth)
- **Supabase Pro** : $25/mois (8GB DB, 100GB storage)
- **EmailJS Pro** : $15/mois (10K emails)
- **CDN** (Cloudflare) : $20/mois
- **Total** : ~$80/mois pour 10K+ utilisateurs actifs

## 📈 Potentiel Business

### Audience cible

- **Joueurs GTA 6** : 50M+ attendus au lancement
- **Créateurs de mods** : Communauté active et passionnée
- **SEO** : Faible concurrence sur "GTA 6 mods"

### Modèles de revenus

1. **Publicité** : Google AdSense, sponsors gaming
2. **Premium** : Fonctionnalités avancées, stockage
3. **Marketplace** : Commission sur ventes de mods
4. **Partenariats** : Streamers, YouTubers gaming
5. **Donations** : Support communautaire

### Avantages concurrentiels

- **First-mover advantage** : Position précoce sur GTA 6
- **UX moderne** : Interface supérieure aux sites existants
- **Performance** : Rapidité et fiabilité
- **SEO-ready** : Optimisé pour le référencement
- **Scalabilité** : Architecture moderne et évolutive

---

## 👨‍💻 Développeur

Créé entièrement en solo par un développeur passionné, sans aucune aide extérieure.

**Contact** : compteprodylan09@gmail.com

---

## 📄 License

Propriété exclusive - Tous droits réservés
