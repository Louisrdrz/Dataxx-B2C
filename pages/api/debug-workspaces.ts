// API Route pour déboguer les workspaces
// Appelez cette route : http://localhost:3000/api/debug-workspaces?userId=VOTRE_USER_ID

import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebase/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ 
      error: 'userId requis dans la query string',
      example: '/api/debug-workspaces?userId=YOUR_USER_ID'
    });
  }

  try {
    const debug: any = {
      userId,
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // 1. Vérifier l'utilisateur
    const userDoc = await adminDb.collection('users').doc(userId).get();
    debug.checks.userExists = userDoc.exists;
    debug.checks.userData = userDoc.exists ? userDoc.data() : null;

    // 2. Récupérer tous les workspaceMembers pour cet utilisateur
    const membersSnapshot = await adminDb
      .collection('workspaceMembers')
      .where('userId', '==', userId)
      .get();
    
    debug.checks.memberCount = membersSnapshot.size;
    debug.checks.memberDocs = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    // 3. Pour chaque workspace membre, récupérer le workspace
    const workspaceIds = membersSnapshot.docs.map(doc => doc.data().workspaceId);
    const workspaces = [];
    
    for (const workspaceId of workspaceIds) {
      const workspaceDoc = await adminDb.collection('workspaces').doc(workspaceId).get();
      workspaces.push({
        id: workspaceId,
        exists: workspaceDoc.exists,
        data: workspaceDoc.exists ? workspaceDoc.data() : null
      });
    }

    debug.checks.workspaces = workspaces;

    // 4. Vérifier les règles de sécurité (info uniquement)
    debug.info = {
      message: 'Si memberCount > 0 mais que les workspaces n\'apparaissent pas dans l\'app, vérifiez les règles Firestore',
      ruleCheck: 'Les règles Firestore doivent permettre la lecture des workspaces aux membres',
      deployCommand: 'npx firebase deploy --only firestore:rules'
    };

    // 5. Résumé
    debug.summary = {
      userExists: debug.checks.userExists,
      totalMembers: debug.checks.memberCount,
      totalWorkspaces: workspaces.filter(w => w.exists).length,
      workspaceIds: workspaceIds,
      diagnosis: generateDiagnosis(debug)
    };

    return res.status(200).json(debug);

  } catch (error: any) {
    console.error('Erreur dans debug-workspaces:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}

function generateDiagnosis(debug: any): string[] {
  const issues = [];

  if (!debug.checks.userExists) {
    issues.push('❌ L\'utilisateur n\'existe pas dans Firestore');
  }

  if (debug.checks.memberCount === 0) {
    issues.push('❌ Aucun workspace membre trouvé pour cet utilisateur');
    issues.push('💡 L\'utilisateur doit créer un workspace ou être invité à un workspace existant');
  }

  const existingWorkspaces = debug.checks.workspaces.filter((w: any) => w.exists).length;
  if (debug.checks.memberCount > 0 && existingWorkspaces === 0) {
    issues.push('❌ Des documents workspaceMembers existent mais les workspaces correspondants n\'existent pas');
    issues.push('💡 Nettoyez les documents orphelins dans workspaceMembers');
  }

  if (debug.checks.memberCount > 0 && existingWorkspaces > 0) {
    issues.push('✅ Tout semble correct côté base de données');
    issues.push('💡 Si les workspaces n\'apparaissent pas, vérifiez :');
    issues.push('   1. Les règles Firestore (npx firebase deploy --only firestore:rules)');
    issues.push('   2. Les logs de la console du navigateur');
    issues.push('   3. Que l\'utilisateur est bien connecté avec le même UID');
  }

  return issues;
}

