import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SponsorRecommendation {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  matchScore: number; // 0-100
  matchReasons: string[];
  estimatedBudget: string;
  contactStrategy: string;
  website?: string;
  linkedIn?: string;
  keyContacts?: string[];
  pastSponsorships?: string[];
  valuesAlignment: string[];
  potentialActivations: string[];
  priority: 'high' | 'medium' | 'low';
  category: 'title' | 'official' | 'technical' | 'media' | 'local' | 'startup';
}

export interface RecommendationRequest {
  workspaceData: {
    name: string;
    description?: string;
    type?: string;
    enrichedData?: any;
  };
  sponsorNeeds: {
    eventName: string;
    eventDate?: string;
    eventDescription: string;
    targetBudget: string;
    sponsorTypes: string[];
    industries?: string[];
    values?: string[];
    audienceSize?: string;
    mediaExposure?: string;
    specificNeeds?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workspaceData, sponsorNeeds } = req.body as RecommendationRequest;

    if (!workspaceData || !sponsorNeeds) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const prompt = `Tu es un expert en sponsoring sportif et en partenariats commerciaux. Analyse les informations suivantes et génère des recommandations de sponsors qualifiés.

## INFORMATIONS DU WORKSPACE/PROJET
- Nom: ${workspaceData.name}
- Description: ${workspaceData.description || 'Non spécifié'}
- Type: ${workspaceData.type || 'Non spécifié'}
${workspaceData.enrichedData ? `
- Palmarès: ${JSON.stringify(workspaceData.enrichedData.achievements || [])}
- Sponsors actuels: ${JSON.stringify(workspaceData.enrichedData.sponsors || [])}
- Valeurs: ${JSON.stringify(workspaceData.enrichedData.values || [])}
- Mission: ${workspaceData.enrichedData.mission || 'Non spécifiée'}
- Informations athlète: ${JSON.stringify(workspaceData.enrichedData.athleteInfo || {})}
- Informations club: ${JSON.stringify(workspaceData.enrichedData.clubInfo || {})}
` : ''}

## BESOINS EN SPONSORING
- Événement: ${sponsorNeeds.eventName}
- Date: ${sponsorNeeds.eventDate || 'Non spécifiée'}
- Description de l'événement: ${sponsorNeeds.eventDescription}
- Budget cible: ${sponsorNeeds.targetBudget}
- Types de sponsors recherchés: ${sponsorNeeds.sponsorTypes.join(', ')}
- Industries ciblées: ${sponsorNeeds.industries?.join(', ') || 'Toutes'}
- Valeurs importantes: ${sponsorNeeds.values?.join(', ') || 'Non spécifiées'}
- Taille de l'audience: ${sponsorNeeds.audienceSize || 'Non spécifiée'}
- Exposition médiatique: ${sponsorNeeds.mediaExposure || 'Non spécifiée'}
- Besoins spécifiques: ${sponsorNeeds.specificNeeds || 'Aucun'}

## INSTRUCTIONS
Génère une liste de 8-12 sponsors potentiels RÉELS et PERTINENTS (entreprises françaises et internationales connues) qui correspondent parfaitement au profil. Pour chaque sponsor, fournis:
1. Le nom exact de l'entreprise
2. Son industrie/secteur
3. Un score de matching (0-100) basé sur l'alignement des valeurs, l'historique de sponsoring sportif, et la pertinence
4. Les raisons précises du matching (3-5 raisons)
5. Une estimation du budget qu'ils pourraient allouer
6. Une stratégie de contact personnalisée
7. Les valeurs alignées
8. Des idées d'activations potentielles
9. La priorité (high/medium/low)
10. La catégorie (title/official/technical/media/local/startup)

IMPORTANT: 
- Propose des entreprises RÉELLES qui ont un historique de sponsoring sportif ou qui seraient pertinentes
- Adapte les recommandations au contexte français/européen si pertinent
- Sois précis et actionnable dans les stratégies de contact
- Varie les catégories et industries

Réponds UNIQUEMENT en JSON valide avec le format suivant:
{
  "recommendations": [
    {
      "id": "unique-id",
      "name": "Nom de l'entreprise",
      "industry": "Secteur d'activité",
      "matchScore": 85,
      "matchReasons": ["Raison 1", "Raison 2", "Raison 3"],
      "estimatedBudget": "10 000€ - 50 000€",
      "contactStrategy": "Stratégie détaillée...",
      "website": "https://...",
      "pastSponsorships": ["Exemple 1", "Exemple 2"],
      "valuesAlignment": ["Valeur 1", "Valeur 2"],
      "potentialActivations": ["Activation 1", "Activation 2"],
      "priority": "high",
      "category": "official"
    }
  ],
  "globalInsights": {
    "marketAnalysis": "Analyse du marché du sponsoring pour ce type de projet",
    "bestApproachTiming": "Meilleur moment pour approcher les sponsors",
    "negotiationTips": ["Conseil 1", "Conseil 2"],
    "redFlags": ["À éviter 1", "À éviter 2"]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en sponsoring sportif. Tu réponds uniquement en JSON valide, sans markdown, sans commentaires.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0].message.content || '';
    
    // Nettoyer la réponse (enlever les backticks markdown si présents)
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.slice(7);
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    cleanedResponse = cleanedResponse.trim();

    const result = JSON.parse(cleanedResponse);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error generating sponsor recommendations:', error);
    return res.status(500).json({ 
      error: 'Failed to generate recommendations',
      details: error.message 
    });
  }
}

