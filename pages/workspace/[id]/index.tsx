import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceById } from '@/hooks/useWorkspace';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { useIsWorkspaceAdmin } from '@/hooks/useWorkspaceMembers';
import { updateWorkspace } from '@/lib/firebase/workspaces';
import { createInvitation } from '@/lib/firebase/invitations';
import { Workspace } from '@/types/firestore';
import DeckUploader from '@/components/DeckUploader';
import { ExtractedWorkspaceData } from '@/lib/openai/deckAnalyzer';
import { Timestamp } from 'firebase/firestore';
import { withAuth } from '@/lib/firebase/withAuth';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/firestore';

interface WorkspacePageProps {
  user: FirebaseUser;
  userData: User | null;
}

function WorkspacePage({ user, userData }: WorkspacePageProps) {
  const router = useRouter();
  const { id: workspaceId } = router.query;
  
  const { workspace, isLoading: workspaceLoading } = useWorkspaceById(
    typeof workspaceId === 'string' ? workspaceId : undefined
  );
  const { members, isLoading: membersLoading } = useWorkspaceMembers(
    typeof workspaceId === 'string' ? workspaceId : undefined
  );
  const { isAdmin, isLoading: adminLoading } = useIsWorkspaceAdmin(
    typeof workspaceId === 'string' ? workspaceId : undefined,
    user?.uid
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [inviting, setInviting] = useState(false);

  const isLoading = workspaceLoading || membersLoading || adminLoading;

  const handleDataExtracted = async (data: ExtractedWorkspaceData & { 
    fileURL?: string; 
    fileName?: string;
    fileSize?: number;
  }) => {
    if (!workspaceId || typeof workspaceId !== 'string' || !workspace) return;
    
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
      }
      if (data.description) {
        updateData.description = data.description;
      }
      if (data.type) {
        updateData.type = data.type;
      }

      await updateWorkspace(workspaceId, updateData);
      
      setSuccess('Données extraites et workspace mis à jour avec succès !');
      setShowUploader(false);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspaceId || typeof workspaceId !== 'string' || !workspace || !isAdmin) return;
    
    if (!inviteEmail.trim()) {
      setError('Veuillez entrer un email');
      return;
    }

    try {
      setInviting(true);
      setError('');
      
      await createInvitation(
        workspaceId,
        inviteEmail.trim(),
        inviteRole,
        user.uid,
        {
          name: workspace.name,
          logoURL: workspace.logoURL
        },
        userData?.displayName || user.displayName || undefined
      );
      
      setSuccess(`Invitation envoyée à ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteForm(false);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setInviting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du workspace...</p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-200 text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Workspace introuvable</h3>
            <p className="text-slate-600">Ce workspace n'existe pas ou vous n'y avez pas accès</p>
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {workspace.logoURL && (
                <img 
                  src={workspace.logoURL} 
                  alt={workspace.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-lg"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {workspace.name}
                </h1>
                {workspace.description && (
                  <p className="text-slate-600 mt-1">{workspace.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/my-workspaces')}
                className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </button>
              {isAdmin && (
                <button
                  onClick={() => router.push(`/workspace/${workspaceId}/settings`)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </button>
              )}
            </div>
          </div>

          {/* Messages d'erreur/succès */}
          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border-2 border-green-200 text-green-800 p-4 rounded-2xl flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>{success}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Informations du workspace */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section Upload Deck */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Enrichir avec l'IA
              </h2>
              <p className="text-slate-600 mb-6">
                Uploadez un deck commercial pour enrichir automatiquement les informations du workspace avec l'IA OpenAI.
              </p>
              
              {workspace.deckDocument && (
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
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {workspace.deckDocument ? 'Remplacer le deck' : 'Uploader un deck'}
              </button>

              {showUploader && (
                <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <DeckUploader
                    workspaceId={workspaceId as string}
                    userId={user.uid}
                    onDataExtracted={handleDataExtracted}
                    onError={setError}
                  />
                </div>
              )}
            </div>

            {/* Section Informations du workspace */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Informations du workspace
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                  <div className="flex items-center gap-2">
                    {workspace.type === 'club' && <span className="text-2xl">🏟️</span>}
                    {workspace.type === 'athlete' && <span className="text-2xl">🏃</span>}
                    {workspace.type === 'personal' && <span className="text-2xl">👤</span>}
                    {workspace.type === 'other' && <span className="text-2xl">📦</span>}
                    <span className="text-slate-800 capitalize">{workspace.type || 'Non défini'}</span>
                  </div>
                </div>

                {workspace.enrichedData && (
                  <div className="space-y-4">
                    {workspace.enrichedData.achievements && workspace.enrichedData.achievements.length > 0 && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Palmarès</label>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {workspace.enrichedData.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {workspace.enrichedData.sponsors && workspace.enrichedData.sponsors.length > 0 && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Sponsors</label>
                        <div className="flex flex-wrap gap-2">
                          {workspace.enrichedData.sponsors.map((sponsor, idx) => (
                            <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
                              {sponsor.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {workspace.enrichedData.mission && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Mission</label>
                        <p className="text-slate-600">{workspace.enrichedData.mission}</p>
                      </div>
                    )}

                    {workspace.enrichedData.values && workspace.enrichedData.values.length > 0 && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Valeurs</label>
                        <div className="flex flex-wrap gap-2">
                          {workspace.enrichedData.values.map((value, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {workspace.enrichedData.athleteInfo && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Informations athlète</label>
                        <div className="grid grid-cols-2 gap-4 text-slate-600">
                          {workspace.enrichedData.athleteInfo.sport && (
                            <div>
                              <span className="font-semibold">Sport:</span> {workspace.enrichedData.athleteInfo.sport}
                            </div>
                          )}
                          {workspace.enrichedData.athleteInfo.position && (
                            <div>
                              <span className="font-semibold">Poste:</span> {workspace.enrichedData.athleteInfo.position}
                            </div>
                          )}
                          {workspace.enrichedData.athleteInfo.nationality && (
                            <div>
                              <span className="font-semibold">Nationalité:</span> {workspace.enrichedData.athleteInfo.nationality}
                            </div>
                          )}
                          {workspace.enrichedData.athleteInfo.currentTeam && (
                            <div>
                              <span className="font-semibold">Équipe actuelle:</span> {workspace.enrichedData.athleteInfo.currentTeam}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {workspace.enrichedData.clubInfo && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Informations club</label>
                        <div className="grid grid-cols-2 gap-4 text-slate-600">
                          {workspace.enrichedData.clubInfo.sport && (
                            <div>
                              <span className="font-semibold">Sport:</span> {workspace.enrichedData.clubInfo.sport}
                            </div>
                          )}
                          {workspace.enrichedData.clubInfo.founded && (
                            <div>
                              <span className="font-semibold">Fondé en:</span> {workspace.enrichedData.clubInfo.founded}
                            </div>
                          )}
                          {workspace.enrichedData.clubInfo.stadium && (
                            <div>
                              <span className="font-semibold">Stade:</span> {workspace.enrichedData.clubInfo.stadium}
                            </div>
                          )}
                          {workspace.enrichedData.clubInfo.league && (
                            <div>
                              <span className="font-semibold">Championnat:</span> {workspace.enrichedData.clubInfo.league}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!workspace.enrichedData && (
                  <div className="text-center py-8 text-slate-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Uploadez un deck commercial pour enrichir les informations</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne latérale - Membres */}
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Membres ({members.length})
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Inviter
                  </button>
                )}
              </div>

              {/* Formulaire d'invitation */}
              {showInviteForm && isAdmin && (
                <form onSubmit={handleInviteMember} className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Rôle</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                        className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="member">Membre</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={inviting}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {inviting ? 'Envoi...' : 'Envoyer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowInviteForm(false);
                          setInviteEmail('');
                        }}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Liste des membres */}
              <div className="space-y-3">
                {membersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    <p className="text-slate-500 text-sm">Chargement...</p>
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>Aucun membre</p>
                  </div>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      {member.userPhotoURL ? (
                        <img
                          src={member.userPhotoURL}
                          alt={member.userDisplayName || member.userEmail}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {(member.userDisplayName || member.userEmail || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {member.userDisplayName || member.userEmail || 'Utilisateur'}
                        </p>
                        <p className="text-sm text-slate-500 truncate">{member.userEmail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.role === 'admin' && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-medium">
                            Admin
                          </span>
                        )}
                        {member.userId === workspace.ownerId && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium">
                            Créateur
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Informations</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <span className="font-semibold">Créé le:</span>{' '}
                  {new Date(workspace.createdAt.seconds * 1000).toLocaleDateString('fr-FR')}
                </div>
                <div>
                  <span className="font-semibold">Membres:</span> {workspace.memberCount || members.length}
                </div>
                {workspace.ownerId === user.uid && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium">
                      Vous êtes le créateur
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(WorkspacePage);





