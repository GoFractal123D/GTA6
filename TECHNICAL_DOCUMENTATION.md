# 📚 Documentation Technique - VIverse

## 🗄️ Schéma de Base de Données

### Vue d'ensemble

La base de données utilise **PostgreSQL** via Supabase avec **Row Level Security (RLS)** activé pour la sécurité.

### Tables principales

#### 👤 `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Usage** : Profils utilisateurs étendus liés à Supabase Auth

#### 📦 `mods`

```sql
CREATE TABLE mods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  tags TEXT[],
  version VARCHAR(20),
  author_id UUID REFERENCES profiles(id),
  image TEXT,
  files JSONB, -- URLs des fichiers uploadés
  downloads INTEGER DEFAULT 0,
  installation TEXT,
  changelog TEXT,
  requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Usage** : Stockage des mods avec métadonnées complètes

#### 💬 `comments`

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  mod_id UUID REFERENCES mods(id),
  parent_id UUID REFERENCES comments(id), -- Pour les réponses
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Usage** : Système de commentaires hiérarchique

#### 👍 `votes`

```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  mod_id UUID REFERENCES mods(id),
  vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mod_id)
);
```

**Usage** : Système de votes (upvote/downvote)

#### 🌟 `mod_ratings`

```sql
CREATE TABLE mod_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  mod_id UUID REFERENCES mods(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mod_id)
);
```

**Usage** : Système de notation 1-5 étoiles

#### 🏘️ `community_posts`

```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  type VARCHAR(20) DEFAULT 'discussion',
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Usage** : Posts de la communauté (discussions, guides, etc.)

#### 💬 `community_comments`

```sql
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  post_id UUID REFERENCES community_posts(id),
  parent_id UUID REFERENCES community_comments(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Usage** : Commentaires sur les posts communautaires

#### 📊 `downloads`

```sql
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  mod_id UUID REFERENCES mods(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Usage** : Tracking des téléchargements pour statistiques

### Storage Buckets

#### `avatars`

- **Usage** : Photos de profil utilisateurs
- **Politiques** : Lecture publique, écriture utilisateur authentifié
- **Formats** : JPEG, PNG, WebP (max 2MB)

#### `mod-images`

- **Usage** : Images et captures d'écran des mods
- **Politiques** : Lecture publique, écriture créateur du mod
- **Formats** : JPEG, PNG, WebP (max 5MB)

#### `mod-files`

- **Usage** : Fichiers des mods (archives, scripts)
- **Politiques** : Lecture authentifiée, écriture créateur
- **Formats** : ZIP, RAR, 7Z (max 100MB)

## 🔐 Sécurité (Row Level Security)

### Politiques RLS actives

```sql
-- Profiles : Lecture publique, modification propriétaire
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Mods : Lecture publique, modification auteur
ALTER TABLE mods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mods are viewable by everyone" ON mods FOR SELECT USING (true);
CREATE POLICY "Authors can modify their mods" ON mods FOR ALL USING (auth.uid() = author_id);

-- Comments : Lecture publique, création authentifiée, modification auteur
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can modify their comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
```

## 🔄 Fonctionnement des Systèmes

### 1. Système de Mods

#### Upload de Mod

```typescript
// 1. Upload des fichiers vers Supabase Storage
const { data: fileData, error: fileError } = await supabase.storage
  .from("mod-files")
  .upload(`${userId}/${modId}/${fileName}`, file);

// 2. Insertion des métadonnées en base
const { data: mod, error } = await supabase.from("mods").insert({
  title,
  description,
  category,
  author_id: userId,
  files: [{ name: fileName, url: fileData.path }],
});
```

#### Téléchargement avec Tracking

```typescript
// 1. Enregistrer le téléchargement
await supabase.from("downloads").insert({
  user_id: userId,
  mod_id: modId,
  ip_address: clientIP,
});

// 2. Incrémenter le compteur
await supabase.rpc("increment_downloads", { mod_id: modId });

// 3. Générer URL de téléchargement sécurisée
const { data } = await supabase.storage
  .from("mod-files")
  .createSignedUrl(filePath, 3600); // 1h d'expiration
```

### 2. Système de Votes

#### Vote/Dévote avec Gestion des Conflits

```typescript
// Upsert pour éviter les doublons
const { error } = await supabase.from("votes").upsert(
  {
    user_id: userId,
    mod_id: modId,
    vote_type: "upvote", // ou 'downvote'
  },
  {
    onConflict: "user_id,mod_id",
  }
);

// Calcul du score en temps réel
const { data: voteCount } = await supabase.rpc("calculate_vote_score", {
  mod_id: modId,
});
```

### 3. Système de Commentaires

#### Commentaires Hiérarchiques

```typescript
// Commentaire principal
const { data: comment } = await supabase.from("comments").insert({
  content,
  author_id: userId,
  mod_id: modId,
  parent_id: null, // Commentaire racine
});

// Réponse à un commentaire
const { data: reply } = await supabase.from("comments").insert({
  content,
  author_id: userId,
  mod_id: modId,
  parent_id: parentCommentId,
});
```

#### Temps Réel avec Supabase Realtime

```typescript
// Écoute des nouveaux commentaires
const subscription = supabase
  .channel(`comments-${modId}`)
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "comments",
      filter: `mod_id=eq.${modId}`,
    },
    (payload) => {
      // Mise à jour UI en temps réel
      updateCommentsUI(payload);
    }
  )
  .subscribe();
```

### 4. Cache et Performance

#### Cache Global Client-Side

```typescript
// Cache des mods avec TTL
const modsCache = {
  data: null,
  timestamp: 0,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  hasBeenInitialized: false,
};

// Vérification validité cache
const isCacheValid = () => {
  return (
    modsCache.data &&
    Date.now() - modsCache.timestamp < modsCache.CACHE_DURATION
  );
};
```

#### Optimisations Base de Données

```sql
-- Index pour les recherches fréquentes
CREATE INDEX idx_mods_category ON mods(category);
CREATE INDEX idx_mods_downloads ON mods(downloads DESC);
CREATE INDEX idx_mods_created_at ON mods(created_at DESC);
CREATE INDEX idx_comments_mod_id ON comments(mod_id);
CREATE INDEX idx_votes_mod_id ON votes(mod_id);

-- Index composites pour les jointures
CREATE INDEX idx_mods_author_created ON mods(author_id, created_at DESC);
CREATE INDEX idx_comments_mod_parent ON comments(mod_id, parent_id);
```

## 🔌 Intégrations

### EmailJS (Confirmation utilisateurs)

```typescript
// Configuration service
const emailService = {
  SERVICE_ID: "gmail_service",
  TEMPLATE_ID: "confirmation_template",
  PUBLIC_KEY: "your_public_key",
};

// Envoi email de confirmation
const sendConfirmationEmail = async (
  email: string,
  username: string,
  code: string
) => {
  return emailjs.send(
    emailService.SERVICE_ID,
    emailService.TEMPLATE_ID,
    {
      to_email: email,
      to_name: username,
      confirmation_code: code,
      app_name: "VIverse",
    },
    emailService.PUBLIC_KEY
  );
};
```

### Supabase Auth

```typescript
// Inscription avec métadonnées
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username: email.split('@')[0]
    }
  }
});

// Trigger de création de profil
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📊 Fonctions SQL Personnalisées

### Statistiques en Temps Réel

```sql
-- Calcul score de vote
CREATE OR REPLACE FUNCTION calculate_vote_score(mod_id UUID)
RETURNS INTEGER AS $$
DECLARE
  upvotes INTEGER;
  downvotes INTEGER;
BEGIN
  SELECT COUNT(*) INTO upvotes FROM votes
  WHERE votes.mod_id = $1 AND vote_type = 'upvote';

  SELECT COUNT(*) INTO downvotes FROM votes
  WHERE votes.mod_id = $1 AND vote_type = 'downvote';

  RETURN upvotes - downvotes;
END;
$$ LANGUAGE plpgsql;

-- Incrément téléchargements atomique
CREATE OR REPLACE FUNCTION increment_downloads(mod_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE mods SET downloads = downloads + 1 WHERE id = $1;
END;
$$ LANGUAGE plpgsql;
```

### Recherche Full-Text

```sql
-- Index de recherche textuelle
CREATE INDEX idx_mods_search ON mods
USING gin(to_tsvector('french', title || ' ' || description));

-- Fonction de recherche
CREATE OR REPLACE FUNCTION search_mods(search_term TEXT)
RETURNS TABLE(
  id UUID,
  title VARCHAR,
  description TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.title,
    m.description,
    ts_rank(to_tsvector('french', m.title || ' ' || m.description),
            plainto_tsquery('french', search_term)) as rank
  FROM mods m
  WHERE to_tsvector('french', m.title || ' ' || m.description)
        @@ plainto_tsquery('french', search_term)
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;
```

## 🔧 Configuration Avancée

### Variables d'Environnement Complètes

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Admin only

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx

# Analytics (optionnel)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Monitoring (optionnel)
SENTRY_DSN=https://xxx@sentry.io/xxx

# Upload limits
NEXT_PUBLIC_MAX_FILE_SIZE=104857600 # 100MB
NEXT_PUBLIC_MAX_IMAGE_SIZE=5242880  # 5MB
```

### Configuration Next.js

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ["supabase_project_id.supabase.co", "localhost"],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    serverActions: true,
  },
  // Optimisation bundle
  transpilePackages: ["lucide-react"],
  // CSP Headers pour sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};
```

## 🚀 Déploiement en Production

### Checklist Pré-déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données avec données de test
- [ ] Storage buckets configurés
- [ ] Politiques RLS activées
- [ ] Domain configuré avec SSL
- [ ] Analytics configurées
- [ ] Monitoring configuré

### Optimisations Production

```typescript
// Optimisation images Next.js
<Image
  src={mod.image}
  alt={mod.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index < 3} // LCP pour les 3 premiers
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>;

// Lazy loading composants
const LazyModCard = dynamic(() => import("./ModCard"), {
  loading: () => <ModCardSkeleton />,
  ssr: false,
});
```

---

**Contact technique** : compteprodylan09@gmail.com
