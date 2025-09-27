import { createClient } from '@supabase/supabase-js'

// Configuration avec variables d'environnement (avec fallback pour rétrocompatibilité)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxazszzgjjwwfifvkfue.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YXpzenpnamp3d2ZpZnZrZnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzA5NDksImV4cCI6MjA2ODcwNjk0OX0.-YmvjXpGanm7Tmh-q9IfYH9Es0Ivp8u319ChRsEMWZA'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 