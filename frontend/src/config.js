// Configuration front
// Définir le numéro WhatsApp dans Netlify: VITE_WHATSAPP_PHONE (peut contenir espaces ou +, on nettoie en chiffres)
const RAW_WA = import.meta.env.VITE_WHATSAPP_PHONE || '+229 01 96 48 65 57';
export const WHATSAPP_PHONE = String(RAW_WA).replace(/\D+/g, '');
