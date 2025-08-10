import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { email, code, username, password } = await request.json();

    if (!email || !code || !username || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier le code de confirmation
    const { data: confirmationData, error: verificationError } = await supabase
      .from('confirmation_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (verificationError || !confirmationData) {
      return NextResponse.json(
        { error: 'Code de confirmation invalide ou expiré' },
        { status: 400 }
      );
    }

    // Créer le compte utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Supprimer le code de confirmation utilisé
    await supabase
      .from('confirmation_codes')
      .delete()
      .eq('email', email)
      .eq('code', code);

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user: authData.user
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du code:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
