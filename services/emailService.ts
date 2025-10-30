import emailjs from "@emailjs/browser";

const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

export interface DemoRequestData {
  firstName: string; 
  lastName: string; 
  email: string; 
  company: string; 
  phone: string; 
  message: string;
}

export async function sendDemoRequest(formData: DemoRequestData): Promise<void> {
  if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
    throw new Error("Configuration EmailJS manquante. Vérifiez vos variables d'environnement.");
  }
  const templateParams = {
    to_email: "clement@dataxx.fr",
    from_name: `${formData.firstName} ${formData.lastName}`,
    from_email: formData.email,
    company: formData.company,
    phone: formData.phone || "Non renseigné",
    message: formData.message,
    subject: `Nouvelle demande de démo - ${formData.company}`,
    submission_date: new Date().toLocaleDateString("fr-FR"),
    submission_time: new Date().toLocaleTimeString("fr-FR"),
  } as Record<string, string>;
  await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey);
}
