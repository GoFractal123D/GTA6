import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Validation de la taille (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 10MB)' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `uploads/${timestamp}_${file.name}`;

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('community-uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Erreur upload Supabase:', error);
      return NextResponse.json(
        { error: `Erreur upload: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      path: data.path,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/community-uploads/${data.path}`
    });

  } catch (error) {
    console.error('Erreur API upload:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 