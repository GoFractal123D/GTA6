import emailjs from '@emailjs/browser';

// Configuration EmailJS
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_uhmp2um',
  TEMPLATE_ID: 'template_x6haubl',
  PUBLIC_KEY: '5NyviO6Jfs7ErZFQI',
};

// Initialiser EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

// Fonction pour envoyer un email de confirmation
export const sendConfirmationEmail = async (
  email: string, 
  username: string, 
  code: string
): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: email,
      to_name: username,
      confirmation_code: code,
      from_name: 'GTA6 Mods Community',
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email envoyé avec succès:', result);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};
