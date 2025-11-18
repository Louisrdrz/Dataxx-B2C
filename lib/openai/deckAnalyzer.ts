// Service d'analyse de deck commercial via OpenAI
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface ExtractedWorkspaceData {
  name?: string;
  description?: string;
  type?: 'club' | 'athlete' | 'personal' | 'other';
  enrichedData?: {
    achievements?: string[];
    sponsors?: Array<{
      name: string;
      type?: 'title' | 'official' | 'technical' | 'media' | 'other';
    }>;
    statistics?: {
      [key: string]: string | number;
    };
    history?: string[];
    values?: string[];
    mission?: string;
    athleteInfo?: {
      sport?: string;
      position?: string;
      birthDate?: string;
      nationality?: string;
      height?: string;
      weight?: string;
      currentTeam?: string;
    };
    clubInfo?: {
      sport?: string;
      founded?: number;
      stadium?: string;
      capacity?: number;
      league?: string;
      colors?: string[];
    };
    customData?: {
      [key: string]: any;
    };
  };
}

/**
 * Analyser un deck commercial PDF avec OpenAI
 * @param pdfBuffer Le PDF sous forme de Buffer
 * @param fileName Le nom du fichier
 * @returns Les données extraites du document
 */
export async function analyzeDeck(
  pdfBuffer: Buffer,
  fileName: string
): Promise<ExtractedWorkspaceData> {
  try {
    // Extraire le texte du PDF
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error('Le PDF ne contient pas de texte extractible. Il s\'agit peut-être d\'un PDF scanné.');
    }

    const prompt = `Tu es un assistant spécialisé dans l'extraction d'informations depuis des decks commerciaux d'athlètes et de clubs sportifs.

Analyse ce document et extrais TOUTES les informations pertinentes. Renvoie les données au format JSON suivant (tous les champs sont optionnels):

{
  "name": "Nom de l'athlète ou du club",
  "description": "Description courte résumant l'essentiel",
  "type": "club" ou "athlete" (détermine automatiquement),
  "enrichedData": {
    "achievements": ["Liste des titres, récompenses, victoires importantes"],
    "sponsors": [
      {
        "name": "Nom du sponsor",
        "type": "title" | "official" | "technical" | "media" | "other"
      }
    ],
    "statistics": {
      "cle": "valeur" (ex: "founded": 1970, "members": 50000)
    },
    "history": ["Événements marquants de l'historique"],
    "values": ["Valeurs du club ou de l'athlète"],
    "mission": "Mission ou vision",
    "athleteInfo": {
      "sport": "Sport pratiqué",
      "position": "Poste",
      "birthDate": "Date de naissance",
      "nationality": "Nationalité",
      "height": "Taille",
      "weight": "Poids",
      "currentTeam": "Équipe actuelle"
    },
    "clubInfo": {
      "sport": "Sport principal",
      "founded": année de fondation (nombre),
      "stadium": "Nom du stade",
      "capacity": capacité du stade (nombre),
      "league": "Championnat",
      "colors": ["Couleurs du club"]
    },
    "customData": {
      "toute_autre_info_pertinente": "valeur"
    }
  }
}

Instructions importantes:
- Extrais TOUTES les informations disponibles dans le document
- Si c'est un athlète, remplis athleteInfo et laisse clubInfo vide
- Si c'est un club, remplis clubInfo et laisse athleteInfo vide
- Sois exhaustif dans l'extraction des sponsors, achievements, et statistics
- Retourne UNIQUEMENT le JSON, sans texte avant ou après
- Si une information n'est pas disponible, ne l'inclus pas dans le JSON

Voici le contenu du document (${fileName}):

---
${pdfText}
---
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Aucune réponse d\'OpenAI');
    }

    // Parser la réponse JSON
    // Enlever les éventuels markdown code blocks
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const extractedData: ExtractedWorkspaceData = JSON.parse(jsonStr);
    
    return extractedData;
  } catch (error: any) {
    console.error('Erreur lors de l\'analyse du deck:', error);
    
    // Si c'est une erreur de parsing JSON, essayer de récupérer
    if (error instanceof SyntaxError) {
      throw new Error('Format de réponse invalide de l\'API OpenAI');
    }
    
    throw new Error(error.message || 'Erreur lors de l\'analyse du document');
  }
}

/**
 * Tester la connexion à l'API OpenAI
 */
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('Erreur de connexion à OpenAI:', error);
    return false;
  }
}

