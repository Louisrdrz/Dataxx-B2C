import { withAuth } from '@/lib/firebase/withAuth';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/firestore';

interface DashboardProps {
  user: FirebaseUser;
  userData: User | null;
}

const DashboardPage = ({ user, userData }: DashboardProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - Dataxx</title>
        <meta name="description" content="Votre tableau de bord Dataxx" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Bienvenue, {userData?.displayName || user.email} ! 👋
            </h2>
            <p className="text-gray-600 mb-6">
              Voici votre tableau de bord Dataxx. Vous pouvez gérer vos données et votre profil ici.
            </p>
            
            {!user.emailVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  ⚠️ Votre email n'est pas encore vérifié. Veuillez consulter votre boîte mail.
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Statut du compte</h3>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-2xl font-bold text-secondary">Actif</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Email vérifié</h3>
                <span className="text-2xl">{user.emailVerified ? '✅' : '❌'}</span>
              </div>
              <p className="text-2xl font-bold text-secondary">
                {user.emailVerified ? 'Oui' : 'Non'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Langue</h3>
                <span className="text-2xl">🌍</span>
              </div>
              <p className="text-2xl font-bold text-secondary">
                {userData?.language === 'fr' ? 'Français' : 'English'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <h3 className="text-xl font-bold text-secondary mb-4">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/my-workspaces')}
                className="flex flex-col items-center justify-center p-6 border-2 border-blue-200 bg-blue-50 rounded-xl hover:border-blue-400 hover:bg-blue-100 transition-all"
              >
                <span className="text-3xl mb-2">📁</span>
                <span className="font-semibold text-secondary">Mes Workspaces</span>
                <span className="text-sm text-gray-500 mt-1">Gérer mes espaces</span>
              </button>
              
              <button
                onClick={() => router.push('/google-data')}
                className="flex flex-col items-center justify-center p-6 border-2 border-green-200 bg-green-50 rounded-xl hover:border-green-400 hover:bg-green-100 transition-all"
              >
                <span className="text-3xl mb-2">🔗</span>
                <span className="font-semibold text-secondary">Données Google</span>
                <span className="text-sm text-gray-500 mt-1">Importer calendrier/contacts</span>
              </button>
              
              <button
                onClick={() => router.push('/profile')}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-purple-50 transition-all"
              >
                <span className="text-3xl mb-2">👤</span>
                <span className="font-semibold text-secondary">Mon Profil</span>
                <span className="text-sm text-gray-500 mt-1">Gérer mes informations</span>
              </button>
              
              <button
                onClick={() => router.push('/subscription')}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-purple-50 transition-all"
              >
                <span className="text-3xl mb-2">💳</span>
                <span className="font-semibold text-secondary">Abonnement</span>
                <span className="text-sm text-gray-500 mt-1">Gérer mon plan</span>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary">Informations du compte</h3>
              <button
                onClick={() => router.push('/profile')}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Modifier →
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="text-secondary">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Nom d'affichage</span>
                <span className="text-secondary">{userData?.displayName || 'Non défini'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Prénom</span>
                <span className="text-secondary">{userData?.firstName || 'Non défini'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Nom</span>
                <span className="text-secondary">{userData?.lastName || 'Non défini'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Compte créé le</span>
                <span className="text-secondary">
                  {userData?.createdAt 
                    ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 font-medium">Dernière connexion</span>
                <span className="text-secondary">
                  {userData?.lastLoginAt 
                    ? new Date(userData.lastLoginAt.seconds * 1000).toLocaleString('fr-FR')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// Protéger la page avec l'authentification
export default withAuth(DashboardPage);
