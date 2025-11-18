// API pour analyser un deck commercial avec OpenAI
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import { analyzeDeck, ExtractedWorkspaceData } from '@/lib/openai/deckAnalyzer';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';

// Désactiver le bodyParser de Next.js pour utiliser formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResponse {
  success: boolean;
  data?: ExtractedWorkspaceData & {
    fileURL?: string;
    fileName?: string;
    fileSize?: number;
  };
  error?: string;
}

/**
 * Convertir un fichier DOCX en texte
 */
async function convertDocxToText(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/**
 * Créer un PDF à partir de texte (simplifié)
 */
async function createPDFFromText(text: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  
  // Ajouter le texte (version simplifiée - on pourrait améliorer la mise en forme)
  const { height } = page.getSize();
  const fontSize = 12;
  const maxCharsPerLine = 80;
  const lines = text.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g')) || [];
  
  let y = height - 50;
  for (const line of lines.slice(0, 60)) { // Limiter pour éviter de déborder
    if (y < 50) break;
    page.drawText(line, {
      x: 50,
      y,
      size: fontSize,
    });
    y -= fontSize + 4;
  }
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Convertir un fichier en PDF si nécessaire
 */
async function ensurePDF(file: File): Promise<{ buffer: Buffer; wasConverted: boolean }> {
  const filePath = file.filepath;
  
  // Si c'est déjà un PDF, le lire directement
  if (file.mimetype === 'application/pdf') {
    const buffer = await fs.readFile(filePath);
    return { buffer, wasConverted: false };
  }
  
  // Si c'est un DOCX, le convertir
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.originalFilename?.endsWith('.docx')
  ) {
    const text = await convertDocxToText(filePath);
    const pdfBuffer = await createPDFFromText(text);
    return { buffer: pdfBuffer, wasConverted: true };
  }
  
  // Si c'est un PPT/PPTX, pour l'instant on ne supporte pas la conversion complète
  // On retourne une erreur
  if (
    file.mimetype === 'application/vnd.ms-powerpoint' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    throw new Error('La conversion de PowerPoint n\'est pas encore supportée. Veuillez exporter votre présentation en PDF.');
  }
  
  throw new Error('Format de fichier non supporté. Utilisez PDF ou DOCX.');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  try {
    // Parser le formulaire multipart
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50 MB max
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    const workspaceId = fields.workspaceId?.[0];
    const userId = fields.userId?.[0];
    
    if (!workspaceId || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'workspaceId et userId sont requis' 
      });
    }

    const uploadedFile = files.file?.[0];
    
    if (!uploadedFile) {
      return res.status(400).json({ success: false, error: 'Aucun fichier uploadé' });
    }

    // Convertir en PDF si nécessaire
    const { buffer: pdfBuffer, wasConverted } = await ensurePDF(uploadedFile);
    
    // Analyser avec OpenAI (passe le Buffer directement)
    const extractedData = await analyzeDeck(
      pdfBuffer,
      uploadedFile.originalFilename || 'deck.pdf'
    );

    // Nettoyer le fichier temporaire
    await fs.unlink(uploadedFile.filepath).catch(console.error);

    // Retourner les données extraites
    // Note : fileURL, fileName et fileSize sont ajoutés par le client
    return res.status(200).json({
      success: true,
      data: extractedData,
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'upload:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors du traitement du fichier',
    });
  }
}

