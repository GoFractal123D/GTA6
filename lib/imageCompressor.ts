// Compresseur d'images pour réduire la taille avant upload
export class ImageCompressor {
  static async compressImage(file: File, maxSizeMB: number = 20): Promise<File> {
    return new Promise((resolve, reject) => {
      // Si le fichier n'est pas une image, le retourner tel quel
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      // Si le fichier est déjà assez petit, le retourner tel quel
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size <= maxSizeBytes) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions (plus conservateur)
        let { width, height } = img;
        const maxDimension = 2560; // Dimension maximale augmentée

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        // Redimensionner le canvas
        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en blob avec compression moins agressive
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Créer un nouveau fichier avec le blob compressé
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              console.log(`Image compressée: ${file.size} -> ${compressedFile.size} bytes`);
              resolve(compressedFile);
            } else {
              reject(new Error('Impossible de compresser l\'image'));
            }
          },
          file.type,
          0.9 // Qualité de compression augmentée (0.9 = 90%)
        );
      };

      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image'));
      };

      // Charger l'image
      img.src = URL.createObjectURL(file);
    });
  }

  static async compressIfNeeded(file: File): Promise<File> {
    const maxSizeMB = 20; // 20MB max (augmenté)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size <= maxSizeBytes) {
      return file;
    }

    console.log(`Compression nécessaire: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    try {
      const compressedFile = await this.compressImage(file, maxSizeMB);
      console.log(`Compression réussie: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      return compressedFile;
    } catch (error) {
      console.error('Erreur de compression:', error);
      // En cas d'erreur, retourner le fichier original
      return file;
    }
  }
} 