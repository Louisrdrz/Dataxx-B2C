import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createWorkspace } from '@/lib/firebase/workspaces';
import { useRouter } from 'next/router';

export default function CreateWorkspacePage() {
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'personal' | 'club' | 'athlete' | 'other'>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser) {
      setError('Vous devez être connecté');
      return;
    }

    if (!name.trim()) {
      setError('Le nom est requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const workspaceId = await createWorkspace(firebaseUser.uid, {
        name: name.trim(),
        description: description.trim() || undefined,
        type,
      });

      alert(`✅ Workspace créé avec succès ! Vous êtes maintenant admin de "${name}"`);
      router.push('/my-workspaces');
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la création du workspace');
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <p className="text-gray-700">Veuillez vous connecter pour créer un workspace</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Créer un workspace</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Retour
            </button>
          </div>
          
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Info :</strong> Vous serez automatiquement défini comme <strong>admin</strong> de ce workspace.
            </p>
          </div>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du workspace *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mon équipe, Mon club, Mes données..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de workspace *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="personal">Personnel</option>
                <option value="club">Club sportif</option>
                <option value="athlete">Athlète</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optionnel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de votre workspace"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-semibold"
            >
              {loading ? '⏳ Création en cours...' : '✅ Créer le workspace'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">En tant qu'admin, vous pourrez :</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Inviter d'autres membres</li>
              <li>• Gérer les rôles et permissions</li>
              <li>• Importer et partager des données Google</li>
              <li>• Configurer les paramètres du workspace</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

