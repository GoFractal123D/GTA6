import emailjs from '@emailjs/browser';

// Configuration EmailJS
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_uhmp2um',
  TEMPLATE_ID: 'template_x6haubl',
  PUBLIC_KEY: '5NyviO6Jfs7ErZFQI',
};

// Initialiser EmailJS
export const initEmailJS = () => {
  try {
    if (!emailjs) {
      console.error('❌ EmailJS library non disponible');
      return false;
    }

    if (!EMAILJS_CONFIG.PUBLIC_KEY) {
      console.error('❌ Clé publique EmailJS manquante');
      return false;
    }

    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('✅ EmailJS initialisé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation d\'EmailJS:', error);
    return false;
  }
};

// Fonction pour envoyer un email de confirmation
export const sendConfirmationEmail = async (
  email: string, 
  username: string, 
  code: string
): Promise<boolean> => {
  try {
    // Vérifier que EmailJS est initialisé
    if (!emailjs) {
      console.error('EmailJS n\'est pas disponible');
      return false;
    }

    // Vérifier la configuration
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      console.error('Configuration EmailJS incomplète:', {
        SERVICE_ID: !!EMAILJS_CONFIG.SERVICE_ID,
        TEMPLATE_ID: !!EMAILJS_CONFIG.TEMPLATE_ID,
        PUBLIC_KEY: !!EMAILJS_CONFIG.PUBLIC_KEY,
      });
      return false;
    }

    console.log('📧 Tentative d\'envoi d\'email à:', email);
    console.log('📧 Configuration utilisée:', {
      SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
      TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
      PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 5) + '...',
    });

    const templateParams = {
      to_email: email,
      email: email, // Variable supplémentaire pour compatibilité
      to_name: username,
      confirmation_code: code,
      from_name: 'GTA6 Mods Community',
    };

    console.log('📧 Paramètres du template:', templateParams);

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('✅ Email envoyé avec succès:', result);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    // Log des détails de l'erreur
    if (error && typeof error === 'object') {
      console.error('Détails de l\'erreur:', {
        message: (error as any).message,
        status: (error as any).status,
        text: (error as any).text,
        name: (error as any).name,
      });
    }

    return false;
  }
};

// Fonction de fallback qui simule l'envoi d'email en mode dev
export const sendConfirmationEmailFallback = async (
  email: string, 
  username: string, 
  code: string
): Promise<boolean> => {
  try {
    console.log('🔄 Mode fallback EmailJS activé');
    console.log('📧 Email simulé pour:', email);
    console.log('👤 Utilisateur:', username);
    console.log('🔢 Code de confirmation:', code);
    
    // En mode développement, on peut juste afficher le code
    if (typeof window !== 'undefined') {
      // Stocker le code dans le localStorage pour debug
      localStorage.setItem(`debug_code_${email}`, code);
      console.log('💾 Code stocké en localStorage pour debug');
    }
    
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Email simulé envoyé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur dans le fallback:', error);
    return false;
  }
};
