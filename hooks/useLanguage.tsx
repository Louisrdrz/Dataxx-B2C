import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traductions
const translations = {
  fr: {
    // Navigation
    'nav.partenariat': 'Partenariat',
    'nav.comment-ca-marche': 'Comment ça marche',
    'nav.benefices': 'Bénéfices',
    'nav.integrations': 'Intégrations',
    'nav.equipe': 'Équipe',
    'nav.demander-demo': 'Demander une démo',
    
    // Hero
    'hero.badge': 'Plateforme propulsée par l\'IA',
    'hero.title': 'La Plateforme IA qui réinvente',
    'hero.title-sportif': 'le sponsoring',
    'hero.title-sportif-end': 'sportif',
    'hero.description': 'Dataxx aide les acteurs du sport à identifier, qualifier et signer plus de sponsors grâce à l\'IA',
    'hero.cta-primary': 'Demander une démo',
    'hero.cta-secondary': 'En savoir plus',
    
    // Trust
    'trust.title': 'Ils nous font confiance',
    'trust.subtitle': 'Des clubs professionnels de renom nous font confiance pour optimiser leur prospection sponsoring',
    'trust.testimonial': 'Dataxx nous a permis d\'identifier et de qualifier nos futurs partenaires avec une précision remarquable.',
    'trust.testimonial.author': 'Direction Commerciale, Stade Rennais F.C.',
    'trust.club.rennais.name': 'Stade Rennais F.C.',
    'trust.club.rennais.league': 'Ligue 1',
    'trust.club.francais.name': 'Stade Français Paris',
    'trust.club.francais.league': 'Top 14',
    
    // How it works
    'how.title': 'Comment ça marche',
    'how.subtitle': 'Trouver des nouveaux sponsors n\'a jamais été aussi simple',
    'how.step1.title': 'Identification des décideurs',
    'how.step1.description': 'Retrouvez les décideurs clés et laissez l\'IA enrichir leurs coordonnées pour engager la conversation au bon niveau.',
    'how.step2.title': 'Qualification',
    'how.step2.description': 'Nous évaluons automatiquement la capacité financière et l\'affinité sectorielle de chaque prospect',
    'how.step3.title': 'Signature',
    'how.step3.description': 'Nous vous accompagnons dans la négociation et la signature des contrats de sponsoring',
    
    // Additional steps
    'how.step4.title': 'Emailing intelligent',
    'how.step4.description': 'L\'IA génère des messages personnalisés et optimisés pour maximiser vos taux de réponse.',
    'how.step5.title': 'CRM intégré',
    'how.step5.description': 'Centralisez vos échanges, suivez vos discussions, organisez vos relances et pilotez vos opportunités.',
    
    // How it works - Step 1 UI elements
    'how.step1.role1': 'Directeur général',
    'how.step1.role2': 'Directeur Marketing',
    'how.step1.role3': 'Responsable Sponsoring',
    'how.step1.action.phone': 'Révéler le téléphone',
    'how.step1.action.email': 'Révéler l\'email',
    
    // How it works - Step 2 UI elements (Emailing intelligent)
    'how.step2.email.to': 'À:',
    'how.step2.email.subject.label': 'Objet:',
    'how.step2.email.subject.value': 'Opportunité de partenariat entre Groupe Samsic et SRFC',
    'how.step2.email.greeting': 'Bonjour Benjamin,',
    'how.step2.email.body.line1': 'Nous avons suivi avec beaucoup d\'intérêt votre partenariat récent avec le Lou Rugby, qui illustre parfaitement votre engagement en faveur de l\'ancrage territorial et du sport de haut niveau.',
    'how.step2.email.body.line2': 'Au SRFC, nous partageons cette vision et pensons qu\'il',
    
    // How it works - Step 3 UI elements (Integrated CRM)
    'how.step3.crm.title': 'Mes contrats',
    'how.step3.crm.status1': 'Prospects',
    'how.step3.crm.status2': 'En négo',
    'how.step3.crm.status3': 'Signé',
    
    // Benefits
    'benefits.title': 'BÉNÉFICES',
    'benefits.why-title': 'Pourquoi choisir Dataxx?',
    'benefits.time.title': 'Gain de temps',
    'benefits.time.description': 'Réduisez de 80% le temps passé à rechercher et qualifier des prospects',
    'benefits.conversion.title': 'Meilleure conversion',
    'benefits.conversion.description': 'Augmentez votre taux de conversion grâce à une qualification précise',
    'benefits.roi.title': 'ROI optimisé',
    'benefits.roi.description': 'Maximisez le retour sur investissement de vos efforts commerciaux',
    
    // Team
    'team.title': 'ÉQUIPE',
    'team.subtitle': 'Notre équipe',
    
    // Footer
    'footer.rights': 'Tous droits réservés',
    'footer.title': 'Nous réinventons le sponsoring sportif grâce à l\'IA.',
    'footer.address': 'Adresse',
    'footer.legal': 'Mentions légales',
    
    // Feature cards
    'features.mapping.title': 'Cartographie du territoire',
    'features.mapping.description': 'Accédez à une vision exhaustive des entreprises locales et nationales pertinentes, organisées par secteur, taille et potentiel de partenariat.',
    'features.mapping.filters.region': 'Région',
    'features.mapping.filters.sector': 'Secteur',
    'features.mapping.filters.potential': 'Potentiel',
    
    'features.profiling.title': 'Profilage & Agent IA',
    'features.profiling.description': 'Notre IA collecte et met à jour en continu : CA, effectifs, historique sponsoring, signaux économiques, actualités et image de marque.',
    'features.profiling.card.title': 'Fiche identité',
    'features.profiling.card.revenue': 'Chiffre d\'affaires',
    'features.profiling.card.activity': 'Activité',
    'features.profiling.card.activity.desc': 'Plateforme IA de cartographie et qualification des entreprises pour le sponsoring sportif.',
    'features.profiling.card.history': 'Historique sponsoring',
    'features.profiling.card.history.desc': 'Partenariats récents avec clubs pros et événements nationaux.',
    'features.profiling.card.brand': 'Image de marque',
    'features.profiling.card.brand.desc': 'Innovante, data-driven et orientée performance mesurable.',
    
    // Profiling card - Company details
    'features.profiling.company.name': 'Dataxx',
    'features.profiling.company.revenue.value': '250M – 500M€',
    
    // Profiling card - Actions
    'features.profiling.action.view': 'Voir fiche',
    'features.profiling.action.export': 'Exporter',
    
    'features.scoring.title': 'Scoring IA de compatibilité',
    'features.scoring.description': 'Un score d\'affinité calcule automatiquement le "fit" entre votre club et chaque entreprise, selon vos objectifs business et vos valeurs.',
    
    // WhyDataxxSection
    'why.title': 'Pourquoi choisir Dataxx?',
    'why.description': 'Dataxx n\'est pas qu\'une base de données : c\'est une plateforme intelligente conçue pour transformer la prospection sponsoring en un levier stratégique de croissance. Nos agents IA combinent données économiques, signaux marché et analyse contextuelle pour offrir à vos équipes une vision que personne d\'autre n\'a.',
    'why.metric1': '70% de temps gagné sur la phase de qualification et de veille',
    'why.metric2': '5x de sponsors touchés sur une saison',
    'why.metric3': '3 min pour comprendre une entreprise et la contacter',
    
    'why.card1.title': 'Vision 360° du marché',
    'why.card1.description': 'Une cartographie dynamique des entreprises qui révèle les futurs sponsors potentiels avant vos concurrents.',
    
    'why.card2.title': 'Agents IA experts',
    'why.card2.description': 'Chaque agent collecte et actualise en continu : sponsoring, signaux économiques, image de marque, RSE et actualités.',
    
    'why.card3.title': 'ROI immédiat et mesurable',
    'why.card3.description': 'Hausse rapide du taux de signature et du panier moyen, avec un retour sur investissement dès la première saison.',
    
    'why.card4.title': 'Avantage concurrentiel durable',
    'why.card4.description': 'Prospection enrichie en continu par l\'IA : vous contactez les bonnes entreprises au bon moment et gardez l\'avance.',
    
    // Comparison section
    'comparison.without.title': 'SANS DATAXX',
    'comparison.without.point1': 'Des heures perdues à chercher des informations éparpillées.',
    'comparison.without.point2': 'Prospection manuelle, lente et inefficace.',
    'comparison.without.point3': 'Contacts difficiles à trouver, bases de données vite obsolètes.',
    'comparison.without.point4': 'Impossible de prioriser les bonnes entreprises.',
    'comparison.without.point5': 'Trop peu de sponsors identifiés = opportunités manquées.',
    'comparison.without.point6': 'Emails envoyés "à l\'aveugle" sans personnalisation.',
    'comparison.without.point7': 'Manque de visibilité sur le marché du sponsoring.',
    'comparison.without.point8': 'Attente passive que les sponsors se manifestent',
    
    'comparison.with.title': 'AVEC DATAXX',
    'comparison.with.point1.title': 'Toute l\'information centralisée',
    'comparison.with.point1.desc': 'Entreprises, contacts, historique sponsoring, actualités… tout en un seul outil.',
    'comparison.with.point2.title': 'Productivité décuplée',
    'comparison.with.point2.desc': 'Des semaines de recherche réduites à quelques clics.',
    'comparison.with.point3.title': 'Identification instantanée des décideurs',
    'comparison.with.point3.desc': 'Les bons contacts trouvés en 1 clic grâce à l\'IA.',
    'comparison.with.point4.title': 'Ciblage intelligent',
    'comparison.with.point4.desc': 'Priorité aux entreprises réellement capables et prêtes à sponsoriser.',
    'comparison.with.point5.title': 'Automatisation de la prospection',
    'comparison.with.point5.desc': 'Moins de tâches chronophages, plus de signatures.',
    'comparison.with.point6.title': 'Emailing IA optimisé',
    'comparison.with.point6.desc': 'Messages personnalisés: plus de réponses, plus vite.',
    'comparison.with.point7.title': 'Pipeline intégré',
    'comparison.with.point7.desc': 'Suivi clair des échanges et relances organisées.',
    
    // Founders section
    'founders.title': 'Rencontrez nos fondateurs',
    'founders.subtitle': 'L\'équipe derrière Dataxx, combinant expertise en IA, opérations et technologie',
    'founders.clement.name': 'Clément Authier',
    'founders.clement.role': 'CEO & Co-founder',
    'founders.martin.name': 'Martin Masseline',
    'founders.martin.role': 'CPO & Co-founder',
    'founders.louis.name': 'Louis Rodriguez',
    'founders.louis.role': 'CTO & Co-founder',
    'founders.tagline': 'Pour les Sportifs. Par des Sportifs',
    
    // Demo page
    'demo.title': 'Réserver une démo',
    'demo.description': 'Passez d\'une prospection manuelle à une approche data‑driven: entreprises pertinentes, score d\'affinité, contacts vérifiés et pipeline centralisé. Remplissez le formulaire pour une démo sur vos cas concrets.',
    'demo.contact.title': 'Informations de contact',
    'demo.contact.email': 'contact@dataxx.fr',
    'demo.contact.phone': '+33 7 83 33 92 93',
    'demo.contact.location': 'Paris, France',
    'demo.contact.linkedin': 'Dataxx',
    'demo.form.title': 'Envoyez-nous un message',
    'demo.form.firstName': 'Prénom',
    'demo.form.firstNamePlaceholder': 'Votre prénom',
    'demo.form.lastName': 'Nom',
    'demo.form.lastNamePlaceholder': 'Votre nom',
    'demo.form.email': 'Email',
    'demo.form.emailPlaceholder': 'votre@email.com',
    'demo.form.company': 'Entreprise',
    'demo.form.companyPlaceholder': 'Votre entreprise',
    'demo.form.phone': 'Téléphone',
    'demo.form.phonePlaceholder': 'Votre numéro de téléphone',
    'demo.form.message': 'Message',
    'demo.form.messagePlaceholder': 'Décrivez votre projet...',
    'demo.form.submit': 'Envoyer la demande',
    'demo.form.loading': 'Envoi en cours...',
    'demo.form.error.required': 'Veuillez remplir tous les champs obligatoires.',
    'demo.form.error.generic': 'Une erreur est survenue lors de l\'envoi.',
    'demo.success.title': 'Demande envoyée !',
    'demo.success.message': 'Merci pour votre intérêt ! Nous vous recontactons dans les plus brefs délais pour organiser votre démo personnalisée.',
    'demo.success.cta': 'Retour à l\'accueil',
    },
  en: {
    // Navigation
    'nav.partenariat': 'Partnership',
    'nav.comment-ca-marche': 'How it works',
    'nav.benefices': 'Benefits',
    'nav.integrations': 'Integrations',
    'nav.equipe': 'Team',
    'nav.demander-demo': 'Request a demo',
    
    // Hero
    'hero.badge': 'AI-powered platform',
    'hero.title': 'The AI Platform that reinvents',
    'hero.title-sportif': 'sports',
    'hero.title-sportif-end': 'sponsorship',
    'hero.description': 'Dataxx helps sports stakeholders identify, qualify and sign more sponsors thanks to AI',
    'hero.cta-primary': 'Request a demo',
    'hero.cta-secondary': 'Learn more',
    
    // Trust
    'trust.title': 'They trust us',
    'trust.subtitle': 'Renowned professional clubs trust us to optimize their sponsorship prospecting',
    'trust.testimonial': 'Dataxx has enabled us to identify and qualify our future partners with remarkable precision.',
    'trust.testimonial.author': 'Commercial Department, Stade Rennais F.C.',
    'trust.club.rennais.name': 'Stade Rennais F.C.',
    'trust.club.rennais.league': 'Ligue 1',
    'trust.club.francais.name': 'Stade Français Paris',
    'trust.club.francais.league': 'Top 14',
    
    // How it works
    'how.title': 'How it works',
    'how.subtitle': 'Finding new sponsors has never been easier',
    'how.step1.title': 'Decision maker identification',
    'how.step1.description': 'Find key decision makers and let AI enrich their contact details to engage at the right level.',
    'how.step2.title': 'Qualification',
    'how.step2.description': 'We automatically evaluate the financial capacity and sectoral affinity of each prospect',
    'how.step3.title': 'Signature',
    'how.step3.description': 'We assist you in the negotiation and signing of sponsorship contracts',
    
    // Additional steps
    'how.step4.title': 'Intelligent emailing',
    'how.step4.description': 'AI generates personalized and optimized messages to maximize your response rates.',
    'how.step5.title': 'Integrated CRM',
    'how.step5.description': 'Centralize your exchanges, track your discussions, organize your follow-ups and manage your opportunities.',
    
    // How it works - Step 1 UI elements
    'how.step1.role1': 'General Director',
    'how.step1.role2': 'Marketing Director',
    'how.step1.role3': 'Sponsorship Manager',
    'how.step1.action.phone': 'Reveal phone',
    'how.step1.action.email': 'Reveal email',
    
    // How it works - Step 2 UI elements (Emailing intelligent)
    'how.step2.email.to': 'To:',
    'how.step2.email.subject.label': 'Subject:',
    'how.step2.email.subject.value': 'Partnership opportunity between Samsic Group and SRFC',
    'how.step2.email.greeting': 'Hello Benjamin,',
    'how.step2.email.body.line1': 'We have followed with great interest your recent partnership with Lou Rugby, which perfectly illustrates your commitment to territorial anchoring and high-level sport.',
    'how.step2.email.body.line2': 'At SRFC, we share this vision and think that it',
    
    // How it works - Step 3 UI elements (Integrated CRM)
    'how.step3.crm.title': 'My contracts',
    'how.step3.crm.status1': 'Prospects',
    'how.step3.crm.status2': 'In negotiation',
    'how.step3.crm.status3': 'Signed',
    
    // Benefits
    'benefits.title': 'BENEFITS',
    'benefits.why-title': 'Why choose Dataxx?',
    'benefits.time.title': 'Time saving',
    'benefits.time.description': 'Reduce by 80% the time spent searching and qualifying prospects',
    'benefits.conversion.title': 'Better conversion',
    'benefits.conversion.description': 'Increase your conversion rate through precise qualification',
    'benefits.roi.title': 'Optimized ROI',
    'benefits.roi.description': 'Maximize the return on investment of your commercial efforts',
    
    // Team
    'team.title': 'TEAM',
    'team.subtitle': 'Our team',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.title': 'We reinvent sports sponsorship through AI.',
    'footer.address': 'Address',
    'footer.legal': 'Legal notice',
    
    // Feature cards
    'features.mapping.title': 'Territory mapping',
    'features.mapping.description': 'Access a comprehensive view of relevant local and national companies, organized by sector, size and partnership potential.',
    'features.mapping.filters.region': 'Region',
    'features.mapping.filters.sector': 'Sector',
    'features.mapping.filters.potential': 'Potential',
    
    'features.profiling.title': 'Profiling & AI Agent',
    'features.profiling.description': 'Our AI continuously collects and updates: revenue, workforce, sponsorship history, economic signals, news and brand image.',
    'features.profiling.card.title': 'Identity card',
    'features.profiling.card.revenue': 'Revenue',
    'features.profiling.card.activity': 'Activity',
    'features.profiling.card.activity.desc': 'AI platform for mapping and qualifying companies for sports sponsorship.',
    'features.profiling.card.history': 'Sponsorship history',
    'features.profiling.card.history.desc': 'Recent partnerships with professional clubs and national events.',
    'features.profiling.card.brand': 'Brand image',
    'features.profiling.card.brand.desc': 'Innovative, data-driven and performance-oriented.',
    
    // Profiling card - Company details
    'features.profiling.company.name': 'Dataxx',
    'features.profiling.company.revenue.value': '250M – 500M€',
    
    // Profiling card - Actions
    'features.profiling.action.view': 'View card',
    'features.profiling.action.export': 'Export',
    
    'features.scoring.title': 'AI compatibility scoring',
    'features.scoring.description': 'An affinity score automatically calculates the "fit" between your club and each company, based on your business objectives and values.',
    
    // WhyDataxxSection
    'why.title': 'Why choose Dataxx?',
    'why.description': 'Dataxx is not just a database: it\'s an intelligent platform designed to transform sponsorship prospecting into a strategic growth lever. Our AI agents combine economic data, market signals and contextual analysis to offer your teams a vision no one else has.',
    'why.metric1': '70% time saved on qualification and monitoring phase',
    'why.metric2': '5x more sponsors reached in a season',
    'why.metric3': '3 min to understand a company and contact it',
    
    'why.card1.title': '360° market vision',
    'why.card1.description': 'A dynamic mapping of companies that reveals future potential sponsors before your competitors.',
    
    'why.card2.title': 'Expert AI agents',
    'why.card2.description': 'Each agent continuously collects and updates: sponsorship, economic signals, brand image, CSR and news.',
    
    'why.card3.title': 'Immediate and measurable ROI',
    'why.card3.description': 'Rapid increase in signature rate and average basket, with a return on investment from the first season.',
    
    'why.card4.title': 'Sustainable competitive advantage',
    'why.card4.description': 'Prospecting continuously enriched by AI: you contact the right companies at the right time and stay ahead.',
    
    // Comparison section
    'comparison.without.title': 'WITHOUT DATAXX',
    'comparison.without.point1': 'Hours lost searching for scattered information.',
    'comparison.without.point2': 'Manual, slow and inefficient prospecting.',
    'comparison.without.point3': 'Difficult contacts to find, quickly obsolete databases.',
    'comparison.without.point4': 'Impossible to prioritize the right companies.',
    'comparison.without.point5': 'Too few sponsors identified = missed opportunities.',
    'comparison.without.point6': 'Emails sent "blindly" without personalization.',
    'comparison.without.point7': 'Lack of visibility on the sponsorship market.',
    'comparison.without.point8': 'Passive waiting for sponsors to come forward',
    
    'comparison.with.title': 'WITH DATAXX',
    'comparison.with.point1.title': 'All information centralized',
    'comparison.with.point1.desc': 'Companies, contacts, sponsorship history, news... all in one tool.',
    'comparison.with.point2.title': 'Tenfold productivity',
    'comparison.with.point2.desc': 'Weeks of research reduced to a few clicks.',
    'comparison.with.point3.title': 'Instant identification of decision-makers',
    'comparison.with.point3.desc': 'The right contacts found in 1 click thanks to AI.',
    'comparison.with.point4.title': 'Intelligent targeting',
    'comparison.with.point4.desc': 'Priority to companies truly capable and ready to sponsor.',
    'comparison.with.point5.title': 'Prospecting automation',
    'comparison.with.point5.desc': 'Fewer time-consuming tasks, more signatures.',
    'comparison.with.point6.title': 'AI-optimized emailing',
    'comparison.with.point6.desc': 'Personalized messages: more responses, faster.',
    'comparison.with.point7.title': 'Integrated pipeline',
    'comparison.with.point7.desc': 'Clear tracking of exchanges and organized follow-ups.',
    
    // Founders section
    'founders.title': 'Meet our founders',
    'founders.subtitle': 'The team behind Dataxx, combining expertise in AI, operations and technology',
    'founders.clement.name': 'Clément Authier',
    'founders.clement.role': 'CEO & Co-founder',
    'founders.martin.name': 'Martin Masseline',
    'founders.martin.role': 'CPO & Co-founder',
    'founders.louis.name': 'Louis Rodriguez',
    'founders.louis.role': 'CTO & Co-founder',
    'founders.tagline': 'For Athletes. By Athletes',
    
    // Demo page
    'demo.title': 'Book a demo',
    'demo.description': 'Go from manual prospecting to a data-driven approach: relevant companies, affinity score, verified contacts, and centralized pipeline. Fill out the form for a demo on your specific use cases.',
    'demo.contact.title': 'Contact Information',
    'demo.contact.email': 'contact@dataxx.fr',
    'demo.contact.phone': '+33 7 83 33 92 93',
    'demo.contact.location': 'Paris, France',
    'demo.contact.linkedin': 'Dataxx',
    'demo.form.title': 'Send us a message',
    'demo.form.firstName': 'First Name',
    'demo.form.firstNamePlaceholder': 'Your first name',
    'demo.form.lastName': 'Last Name',
    'demo.form.lastNamePlaceholder': 'Your last name',
    'demo.form.email': 'Email',
    'demo.form.emailPlaceholder': 'your@email.com',
    'demo.form.company': 'Company',
    'demo.form.companyPlaceholder': 'Your company',
    'demo.form.phone': 'Phone',
    'demo.form.phonePlaceholder': 'Your phone number',
    'demo.form.message': 'Message',
    'demo.form.messagePlaceholder': 'Describe your project...',
    'demo.form.submit': 'Send request',
    'demo.form.loading': 'Sending...',
    'demo.form.error.required': 'Please fill in all required fields.',
    'demo.form.error.generic': 'An error occurred while sending.',
    'demo.success.title': 'Request sent!',
    'demo.success.message': 'Thank you for your interest! We will contact you shortly to organize your personalized demo.',
    'demo.success.cta': 'Back to home',
    }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Charger la langue sauvegardée
    const savedLanguage = localStorage.getItem('dataxx-language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Sauvegarder la langue
    localStorage.setItem('dataxx-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
