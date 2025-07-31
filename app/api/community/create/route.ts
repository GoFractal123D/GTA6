import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author_id, type, title, content, file_url } = body;

    // Validation des données
    if (!author_id || !type || !title || !content) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Préparer les données du post
    const postData = {
      author_id,
      type,
      title: title.trim(),
      content: content.trim(),
      file_url: file_url || null,
    };

    console.log('Tentative d\'insertion du post:', postData);

    // Insérer le post dans la base de données
    const { error: insertError } = await supabase
      .from('community')
      .insert(postData);

    if (insertError) {
      console.error('Erreur insertion post:', insertError);
      return NextResponse.json(
        { error: `Erreur insertion post: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post créé avec succès'
    });

  } catch (error) {
    console.error('Erreur API create post:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 