// Gestion du stockage des fichiers dans Firebase Storage
import { storage } from './config';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  UploadMetadata 
} from 'firebase/storage';

/**
 * Uploader un fichier dans Firebase Storage
 */
export async function uploadFile(
  file: Buffer,
  path: string,
  metadata?: UploadMetadata
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    
    // Upload le fichier
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    throw error;
  }
}

/**
 * Uploader un deck commercial pour un workspace
 */
export async function uploadWorkspaceDeck(
  workspaceId: string,
  file: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `workspaces/${workspaceId}/decks/${Date.now()}_${sanitizedFileName}`;
  
  const metadata: UploadMetadata = {
    contentType: mimeType,
    customMetadata: {
      workspaceId,
      originalFileName: fileName,
      uploadedAt: new Date().toISOString()
    }
  };
  
  return uploadFile(file, path, metadata);
}

/**
 * Supprimer un fichier de Firebase Storage
 */
export async function deleteFile(fileURL: string): Promise<void> {
  try {
    const storageRef = ref(storage, fileURL);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    throw error;
  }
}

/**
 * Supprimer le deck d'un workspace
 */
export async function deleteWorkspaceDeck(workspaceId: string, fileURL: string): Promise<void> {
  return deleteFile(fileURL);
}

