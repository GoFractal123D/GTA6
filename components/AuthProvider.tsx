"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'utilisateur actuel
    const checkUser = async () => {
      try {
        // Vérifier d'abord si Supabase est accessible
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.warn("Erreur d'authentification Supabase, mode hors ligne:", userError);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }
        
        setUser(user);
        
        // Récupérer le profil utilisateur avec le rôle
        if (user) {
          try {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("id, username, email, role, avatar_url, description")
              .eq("id", user.id)
              .single();
            
            if (!error && profile) {
              setUserProfile(profile);
            }
          } catch (profileError) {
            console.warn("Erreur lors de la récupération du profil:", profileError);
          }
        }
      } catch (error) {
        console.warn(
          "Erreur lors de la vérification de l'utilisateur, mode hors ligne:",
          error
        );
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Écouter les changements d'authentification
    try {
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          try {
            setUser(session?.user ?? null);
            
            // Récupérer le profil utilisateur avec le rôle
            if (session?.user) {
              const { data: profile, error } = await supabase
                .from("profiles")
                .select("id, username, email, role, avatar_url, description")
                .eq("id", session.user.id)
                .single();
              
              if (!error && profile) {
                setUserProfile(profile);
              }
            } else {
              setUserProfile(null);
            }
          } catch (profileError) {
            console.warn("Erreur lors de la récupération du profil:", profileError);
          } finally {
            setLoading(false);
          }
        }
      );

      return () => listener?.subscription.unsubscribe();
    } catch (listenerError) {
      console.warn("Erreur lors de la configuration de l'écouteur d'authentification:", listenerError);
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const updateUserProfile = (updates: any) => {
    setUserProfile((prev: any) => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, setUser, signOut, updateUserProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
