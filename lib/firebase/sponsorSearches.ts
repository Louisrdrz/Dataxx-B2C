// Gestion des recherches de sponsors Firestore
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { db } from './config';
import { SponsorSearch, SponsorRecommendation } from '@/types/firestore';

/**
 * Créer une nouvelle recherche de sponsors
 */
export async function createSponsorSearch(
  workspaceId: string,
  userId: string,
  searchData: {
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
    recommendations: SponsorRecommendation[];
    globalInsights?: any;
  }
): Promise<string> {
  try {
    const recommendations = searchData.recommendations.map((r, idx) => ({
      ...r,
      id: r.id || `sponsor-${idx}-${Date.now()}`,
      contactStatus: 'not_contacted' as const,
    }));

    const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
    const averageMatchScore = Math.round(
      recommendations.reduce((acc, r) => acc + r.matchScore, 0) / recommendations.length || 0
    );

    const searchDoc = {
      workspaceId,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      eventName: searchData.eventName,
      eventDate: searchData.eventDate || null,
      eventDescription: searchData.eventDescription,
      targetBudget: searchData.targetBudget,
      sponsorTypes: searchData.sponsorTypes,
      industries: searchData.industries || [],
      values: searchData.values || [],
      audienceSize: searchData.audienceSize || null,
      mediaExposure: searchData.mediaExposure || null,
      specificNeeds: searchData.specificNeeds || null,
      recommendations,
      globalInsights: searchData.globalInsights || null,
      totalRecommendations: recommendations.length,
      highPriorityCount,
      averageMatchScore,
      status: 'completed' as const,
    };

    const docRef = await addDoc(collection(db, 'sponsorSearches'), searchDoc);
    
    console.log('Recherche de sponsors sauvegardée:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la recherche:', error);
    throw error;
  }
}

/**
 * Récupérer une recherche par son ID
 */
export async function getSponsorSearch(searchId: string): Promise<SponsorSearch | null> {
  try {
    const searchDoc = await getDoc(doc(db, 'sponsorSearches', searchId));
    
    if (!searchDoc.exists()) {
      return null;
    }
    
    return {
      id: searchDoc.id,
      ...searchDoc.data()
    } as SponsorSearch;
  } catch (error) {
    console.error('Erreur lors de la récupération de la recherche:', error);
    throw error;
  }
}

/**
 * Récupérer toutes les recherches d'un workspace
 */
export async function getWorkspaceSponsorSearches(workspaceId: string): Promise<SponsorSearch[]> {
  try {
    const q = query(
      collection(db, 'sponsorSearches'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SponsorSearch[];
  } catch (error) {
    console.error('Erreur lors de la récupération des recherches:', error);
    throw error;
  }
}

/**
 * Écouter les recherches d'un workspace en temps réel
 */
export function subscribeToWorkspaceSponsorSearches(
  workspaceId: string,
  callback: (searches: SponsorSearch[]) => void
): () => void {
  const q = query(
    collection(db, 'sponsorSearches'),
    where('workspaceId', '==', workspaceId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const searches = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SponsorSearch[];
    
    callback(searches);
  }, (error) => {
    console.error('Erreur subscription recherches:', error);
  });

  return unsubscribe;
}

/**
 * Mettre à jour le statut de contact d'un sponsor
 */
export async function updateSponsorContactStatus(
  searchId: string,
  sponsorId: string,
  status: 'not_contacted' | 'contacted' | 'in_discussion' | 'accepted' | 'rejected',
  notes?: string
): Promise<void> {
  try {
    const searchDoc = await getDoc(doc(db, 'sponsorSearches', searchId));
    
    if (!searchDoc.exists()) {
      throw new Error('Recherche non trouvée');
    }
    
    const searchData = searchDoc.data() as SponsorSearch;
    const recommendations = searchData.recommendations.map(r => {
      if (r.id === sponsorId) {
        return {
          ...r,
          contactStatus: status,
          contactedAt: status !== 'not_contacted' ? Timestamp.now() : null,
          notes: notes || r.notes,
        };
      }
      return r;
    });
    
    await updateDoc(doc(db, 'sponsorSearches', searchId), {
      recommendations,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Statut de contact mis à jour');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
}

/**
 * Ajouter une note à un sponsor
 */
export async function addSponsorNote(
  searchId: string,
  sponsorId: string,
  note: string
): Promise<void> {
  try {
    const searchDoc = await getDoc(doc(db, 'sponsorSearches', searchId));
    
    if (!searchDoc.exists()) {
      throw new Error('Recherche non trouvée');
    }
    
    const searchData = searchDoc.data() as SponsorSearch;
    const recommendations = searchData.recommendations.map(r => {
      if (r.id === sponsorId) {
        return {
          ...r,
          notes: note,
        };
      }
      return r;
    });
    
    await updateDoc(doc(db, 'sponsorSearches', searchId), {
      recommendations,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error);
    throw error;
  }
}

/**
 * Archiver une recherche
 */
export async function archiveSponsorSearch(searchId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'sponsorSearches', searchId), {
      status: 'archived',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erreur lors de l\'archivage:', error);
    throw error;
  }
}

/**
 * Supprimer une recherche
 */
export async function deleteSponsorSearch(searchId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'sponsorSearches', searchId));
    console.log('Recherche supprimée');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
}

/**
 * Récupérer les statistiques de sponsoring d'un workspace
 */
export async function getSponsorStats(workspaceId: string): Promise<{
  totalSearches: number;
  totalRecommendations: number;
  contacted: number;
  inDiscussion: number;
  accepted: number;
  rejected: number;
}> {
  try {
    const searches = await getWorkspaceSponsorSearches(workspaceId);
    
    let totalRecommendations = 0;
    let contacted = 0;
    let inDiscussion = 0;
    let accepted = 0;
    let rejected = 0;
    
    searches.forEach(search => {
      search.recommendations.forEach(r => {
        totalRecommendations++;
        switch (r.contactStatus) {
          case 'contacted':
            contacted++;
            break;
          case 'in_discussion':
            inDiscussion++;
            break;
          case 'accepted':
            accepted++;
            break;
          case 'rejected':
            rejected++;
            break;
        }
      });
    });
    
    return {
      totalSearches: searches.length,
      totalRecommendations,
      contacted,
      inDiscussion,
      accepted,
      rejected,
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    throw error;
  }
}

