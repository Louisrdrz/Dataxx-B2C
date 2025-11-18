import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { getWorkspace, updateWorkspace, isWorkspaceAdmin } from '@/lib/firebase/workspaces';
import { Workspace } from '@/types/firestore';
import DeckUploader from '@/components/DeckUploader';
import { ExtractedWorkspaceData } from '@/lib/openai/deckAnalyzer';
import { Timestamp } from 'firebase/firestore';
import { withAuth } from '@/lib/firebase/withAuth';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/firestore';

interface WorkspaceSettingsProps {
  user: FirebaseUser;
  userData: User | null;
}

function WorkspaceSettingsPage({ user, userData }: WorkspaceSettingsProps) {
  const router = useRouter();
  const { id: workspaceId } = router.query;
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  
  // États pour les champs éditables
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'personal' | 'club' | 'athlete' | 'other'>('personal');

  useEffect(() => {
    if (workspaceId && typeof workspaceId === 'string' && user) {
      loadWorkspace(workspaceId);
    }
  }, [workspaceId, user]);

  const loadWorkspace = async (id: string) => {
    try {
      setLoading(true);
      const [workspaceData, adminStatus] = await Promise.all([
        getWorkspace(id),
        isWorkspaceAdmin(id, user.uid)
      ]);
      
      if (!workspaceData) {
        setError('Workspace introuvable');
        return;
      }
      
      setWorkspace(workspaceData);
      setIsAdmin(adminStatus);
      setName(workspaceData.name);
      setDescription(workspaceData.description || '');
      setType(workspaceData.type || 'personal');
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDataExtracted = async (data: ExtractedWorkspaceData & { 
    fileURL?: string; 
    fileName?: string;
    fileSize?: number;
  }) => {
    if (!workspaceId || typeof workspaceId !== 'string') return;
    
    try {
      setSaving(true);
      setError('');
      
      const updateData: any = {
        enrichedData: {
          ...workspace?.enrichedData,
          ...data.enrichedData,
        },
      };

      // Ajouter les infos du document
      if (data.fileURL) {
        updateData.deckDocument = {
          url: data.fileURL,
          fileName: data.fileName || 'deck.pdf',
          fileSize: data.fileSize || 0,
          mimeType: 'application/pdf',
          uploadedAt: Timestamp.now(),
          uploadedBy: user.uid,
        };
      }

      // Mettre à jour aussi les champs de base si fournis
      if (data.name) {
        updateData.name = data.name;
        setName(data.name);
      }
      if (data.description) {
        updateData.description = data.description;
        setDescription(data.description);
      }
      if (data.type) {
        updateData.type = data.type;
        setType(data.type);
      }

      await updateWorkspace(workspaceId, updateData);
      
      // Recharger le workspace
      await loadWorkspace(workspaceId);
      
      setSuccess('Données extraites et workspace mis à jour avec succès !');
      setShowUploader(false);
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspaceId || typeof workspaceId !== 'string') return;
    
    try {
      setSaving(true);
      setError('');
      
      await updateWorkspace(workspaceId, {
        name: name.trim(),
        description: description.trim() || undefined,
        type,
      });
      
      setSuccess('Informations mises à jour avec succès !');
      await loadWorkspace(workspaceId);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-200 text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Accès refusé</h3>
            <p className="text-slate-600">Vous devez être administrateur pour accéder aux paramètres</p>
          </div>
          <button
            onClick={() => router.push('/my-workspaces')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
          >
            Retour aux workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Paramètres du workspace
              </h1>
              <p className="text-slate-600">{workspace?.name}</p>
            </div>
            <button
              onClick={() => router.push('/my-workspaces')}
              className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-800 p-4 rounded-2xl flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>{success}</p>
            </div>
          )}

          {/* Section Upload Deck */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Upload deck commercial
            </h2>
            <p className="text-slate-600 mb-6">
              Importez un deck commercial pour enrichir automatiquement les informations du workspace avec l'IA.
            </p>
            
            {workspace?.deckDocument && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-blue-900">{workspace.deckDocument.fileName}</p>
                      <p className="text-sm text-blue-700">
                        Uploadé le {new Date(workspace.deckDocument.uploadedAt.seconds * 1000).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <a
                    href={workspace.deckDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Voir le document
                  </a>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowUploader(!showUploader)}
              className="mb-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {workspace?.deckDocument ? 'Remplacer le deck' : 'Uploader un deck'}
            </button>

            {showUploader && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <DeckUploader
                  workspaceId={workspaceId as string}
                  userId={user.uid}
                  onDataExtracted={handleDataExtracted}
                  onError={setError}
                />
              </div>
            )}
          </div>

          {/* Section Informations de base */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Informations de base
            </h2>
            
            <form onSubmit={handleSaveBasicInfo} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nom du workspace *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="personal">👤 Personnel</option>
                  <option value="club">🏟️ Club sportif</option>
                  <option value="athlete">🏃 Athlète</option>
                  <option value="other">📦 Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Afficher les données enrichies si disponibles */}
          {workspace?.enrichedData && (
            <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Données enrichies par l'IA</h3>
              <pre className="text-sm text-slate-600 overflow-auto max-h-96 bg-white p-4 rounded-lg">
                {JSON.stringify(workspace.enrichedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(WorkspaceSettingsPage);

