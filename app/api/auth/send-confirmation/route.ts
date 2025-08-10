import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json();

    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email et nom d\'utilisateur requis' },
        { status: 400 }
      );
    }

    // Générer un code de confirmation à 4 chiffres
    const confirmationCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Stocker le code temporairement dans la base de données
    // (en production, utilisez Redis ou un service de cache)
    const { error: storageError } = await supabase
      .from('confirmation_codes')
      .upsert({
        email,
        code: confirmationCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        username
      });

    if (storageError) {
      console.error('Erreur lors du stockage du code:', storageError);
      // Si la table n'existe pas, on continue avec le localStorage côté client
    }

    // Envoyer l'email (ici on simule, en production utilisez un service comme SendGrid, Resend, etc.)
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ec4899; text-align: center;">Confirmation d'inscription GTA 6</h2>
        <p>Bonjour ${username},</p>
        <p>Votre code de confirmation pour finaliser votre inscription est :</p>
        <div style="text-align: center; margin: 30px 0;">
          <h1 style="font-size: 48px; color: #ec4899; letter-spacing: 8px; font-family: monospace; background: #f3f4f6; padding: 20px; border-radius: 8px;">
            ${confirmationCode}
          </h1>
        </div>
        <p>Ce code expire dans 10 minutes.</p>
        <p>Si vous n'avez pas demandé cette inscription, ignorez cet email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="text-align: center; color: #6b7280; font-size: 12px;">
          GTA 6 Community - Ne pas répondre à cet email
        </p>
      </div>
    `;

    // En production, remplacez ceci par un vrai service d'envoi d'email
    console.log('=== EMAIL DE CONFIRMATION ===');
    console.log('À:', email);
    console.log('Code:', confirmationCode);
    console.log('Contenu HTML:', emailContent);
    console.log('=============================');

    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Code de confirmation envoyé',
      code: confirmationCode // En production, ne pas renvoyer le code
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du code de confirmation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
