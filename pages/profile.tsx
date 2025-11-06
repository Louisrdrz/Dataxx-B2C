import { useState, useEffect } from 'react';
import { withAuth } from '@/lib/firebase/withAuth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/firestore';
import { updateUserData, getUserData } from '@/lib/firebase/users';
import { signOut } from '@/lib/firebase/auth';

interface ProfileProps {
  user: FirebaseUser;
  userData: User | null;
}

const ProfilePage = ({ user, userData: initialUserData }: ProfileProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  
  const [formData, setFormData] = useState({
    firstName: initialUserData?.firstName || '',
    lastName: initialUserData?.lastName || '',
    displayName: initialUserData?.displayName || '',
    company: initialUserData?.company || '',
    jobTitle: initialUserData?.jobTitle || '',
    phoneNumber: initialUserData?.phoneNumber || '',
    language: initialUserData?.language || 'fr',
    notifications: {
      email: initialUserData?.notifications?.email ?? true,
      push: initialUserData?.notifications?.push ?? true,
    }
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const nameParts = name.split('.');
      
      if (nameParts.length === 2) {
        setFormData(prev => ({
          ...prev,
          [nameParts[0]]: {
            ...(prev[nameParts[0] as keyof typeof prev] as any),
            [nameParts[1]]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateUserData(user.uid, formData);
      
      // Recharger les données utilisateur
      const updatedData = await getUserData(user.uid);
      setUserData(updatedData);
      
      setIsEditing(false);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert("Une erreur est survenue lors de la mise à jour de votre profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      displayName: userData?.displayName || '',
      company: userData?.company || '',
      jobTitle: userData?.jobTitle || '',
      phoneNumber: userData?.phoneNumber || '',
      language: userData?.language || 'fr',
      notifications: {
        email: userData?.notifications?.email ?? true,
        push: userData?.notifications?.push ?? true,
      }
    });
    setIsEditing(false);
  };

  return (
    <>
      <Head>
        <title>Mon Profil - Dataxx</title>
        <meta name="description" content="Gérez vos informations personnelles" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Retour
                </button>
                <h1 className="text-2xl font-bold text-secondary">Mon Profil</h1>
              </div>
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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                {userData?.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-2">
                  {userData?.displayName || 'Utilisateur'}
                </h2>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="flex gap-2">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Email vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      ⚠ Email non vérifié
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary">Informations personnelles</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                >
                  Modifier
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'affichage
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-secondary mb-4">Informations professionnelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Poste
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-secondary mb-4">Préférences</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Notifications
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications.email"
                        name="notifications.email"
                        checked={formData.notifications.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
                      />
                      <label htmlFor="notifications.email" className="ml-2 text-sm text-gray-700">
                        Recevoir des notifications par email
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications.push"
                        name="notifications.push"
                        checked={formData.notifications.push}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
                      />
                      <label htmlFor="notifications.push" className="ml-2 text-sm text-gray-700">
                        Recevoir des notifications push
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information (Read-only) */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-secondary mb-4">Informations du compte</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Email</span>
                    <span className="text-gray-900 font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Compte créé le</span>
                    <span className="text-gray-900 font-medium">
                      {userData?.createdAt 
                        ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Dernière connexion</span>
                    <span className="text-gray-900 font-medium">
                      {userData?.lastLoginAt 
                        ? new Date(userData.lastLoginAt.seconds * 1000).toLocaleString('fr-FR')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default withAuth(ProfilePage);
