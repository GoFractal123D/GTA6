// Gestionnaire d'erreurs centralisé
export class ErrorHandler {
  static isJsonParseError(error: any): boolean {
    return error instanceof SyntaxError && error.message.includes('JSON');
  }

  static isNetworkError(error: any): boolean {
    return error instanceof TypeError && error.message.includes('fetch');
  }

  static isSupabaseError(error: any): boolean {
    return error && typeof error === 'object' && 'message' in error && error.message.includes('supabase');
  }

  static isSupabaseStorageError(error: any): boolean {
    return error && typeof error === 'object' && 'message' in error && (
      error.message.includes('storage') || 
      error.message.includes('bucket') || 
      error.message.includes('upload')
    );
  }

  static getErrorMessage(error: any): string {
    if (this.isJsonParseError(error)) {
      return "Erreur de communication avec le serveur. Veuillez réessayer.";
    }
    
    if (this.isNetworkError(error)) {
      return "Erreur de connexion réseau. Vérifiez votre connexion internet.";
    }
    
    if (this.isSupabaseStorageError(error)) {
      return "Erreur de stockage. Vérifiez que le fichier est valide et réessayez.";
    }
    
    if (this.isSupabaseError(error)) {
      return "Erreur de base de données. Veuillez réessayer.";
    }
    
    return "Une erreur inattendue s'est produite.";
  }

  static logError(context: string, error: any): void {
    console.error(`[${context}] Erreur:`, error);
    
    if (this.isJsonParseError(error)) {
      console.error(`[${context}] Type d'erreur: JSON Parse Error`);
    } else if (this.isNetworkError(error)) {
      console.error(`[${context}] Type d'erreur: Network Error`);
    } else if (this.isSupabaseStorageError(error)) {
      console.error(`[${context}] Type d'erreur: Supabase Storage Error`);
    } else if (this.isSupabaseError(error)) {
      console.error(`[${context}] Type d'erreur: Supabase Error`);
    } else {
      console.error(`[${context}] Type d'erreur: Unknown`);
    }
  }
} 