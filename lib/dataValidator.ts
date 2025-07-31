// Validateur de données pour Supabase
export interface CommunityPostData {
  author_id: string;
  type: string;
  title: string;
  content: string;
  file_url: string | null;
}

export class DataValidator {
  static validateCommunityPost(data: any): { isValid: boolean; validatedData?: CommunityPostData; errors?: string[] } {
    const errors: string[] = [];

    // Vérifier que toutes les données requises sont présentes
    if (!data.author_id) errors.push("author_id est requis");
    if (!data.type) errors.push("type est requis");
    if (!data.title) errors.push("title est requis");
    if (!data.content) errors.push("content est requis");

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Valider et convertir les types
    const validatedData: CommunityPostData = {
      author_id: String(data.author_id),
      type: String(data.type),
      title: String(data.title).trim(),
      content: String(data.content).trim(),
      file_url: data.file_url ? String(data.file_url) : null,
    };

    // Validation supplémentaire
    if (validatedData.title.length === 0) errors.push("Le titre ne peut pas être vide");
    if (validatedData.content.length === 0) errors.push("Le contenu ne peut pas être vide");
    if (validatedData.title.length > 100) errors.push("Le titre ne peut pas dépasser 100 caractères");

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return { isValid: true, validatedData };
  }

  static validateFileUrl(fileUrl: any): string | null {
    if (!fileUrl) return null;
    
    const url = String(fileUrl);
    if (url.length === 0) return null;
    
    // Validation basique d'URL
    try {
      new URL(url);
      return url;
    } catch {
      // Si ce n'est pas une URL valide, on l'accepte quand même car c'est peut-être un chemin relatif
      return url;
    }
  }
} 