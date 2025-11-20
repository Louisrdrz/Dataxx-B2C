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
    },
    // Champs sportifs
    sport: initialUserData?.sport || '',
    sportDuration: initialUserData?.sportDuration || '',
    achievements: initialUserData?.achievements || '',
    links: initialUserData?.links || '',
    nextEvent: initialUserData?.nextEvent || '',
    sponsorType: initialUserData?.sponsorType || '',
    targetAmount: initialUserData?.targetAmount || '',
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      },
      // Champs sportifs
      sport: userData?.sport || '',
      sportDuration: userData?.sportDuration || '',
      achievements: userData?.achievements || '',
      links: userData?.links || '',
      nextEvent: userData?.nextEvent || '',
      sponsorType: userData?.sponsorType || '',
      targetAmount: userData?.targetAmount || '',
    });
    setIsEditing(false);
  };

  return (
    <>
      <Head>
        <title>Mon Profil - Dataxx</title>
        <meta name="description" content="Gérez vos informations personnelles" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Mon Profil</h1>
              </div>
              <button
                onClick={handleSignOut}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Profile Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-48 -mt-48 opacity-30"></div>
            <div className="relative z-10 flex items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl ring-4 ring-white">
                  {userData?.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg">
                  {user.emailVerified ? (
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  {userData?.displayName || 'Utilisateur'}
                </h2>
                <p className="text-slate-600 text-lg mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {user.email}
                </p>
                <div className="flex gap-3">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Email vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200 shadow-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Email non vérifié
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Informations personnelles</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
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
              <div className="border-t-2 border-slate-200 pt-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Informations professionnelles
                </h4>
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
              <div className="border-t-2 border-slate-200 pt-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Préférences
                </h4>
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

              {/* Sports Information */}
              <div className="border-t-2 border-slate-200 pt-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Informations sportives
                </h4>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-2">
                        Sport pratiqué
                      </label>
                      <input
                        type="text"
                        id="sport"
                        name="sport"
                        value={formData.sport}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Ex: Tennis, Football, Natation..."
                      />
                    </div>

                    <div>
                      <label htmlFor="sportDuration" className="block text-sm font-medium text-gray-700 mb-2">
                        Depuis combien de temps
                      </label>
                      <input
                        type="text"
                        id="sportDuration"
                        name="sportDuration"
                        value={formData.sportDuration}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Ex: 5 ans, 10 ans..."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 mb-2">
                      Palmarès
                    </label>
                    <textarea
                      id="achievements"
                      name="achievements"
                      value={formData.achievements}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                      placeholder="Décrivez vos principales réalisations sportives..."
                    />
                  </div>

                  <div>
                    <label htmlFor="links" className="block text-sm font-medium text-gray-700 mb-2">
                      Liens utiles (réseaux sociaux, site web, etc.)
                    </label>
                    <textarea
                      id="links"
                      name="links"
                      value={formData.links}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                      placeholder="Instagram: @votre_compte&#10;Site web: www.votre-site.com&#10;LinkedIn: ..."
                    />
                  </div>

                  <div>
                    <label htmlFor="nextEvent" className="block text-sm font-medium text-gray-700 mb-2">
                      Prochaine échéance sportive
                    </label>
                    <input
                      type="text"
                      id="nextEvent"
                      name="nextEvent"
                      value={formData.nextEvent}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Ex: Championnat national en juin 2025"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="sponsorType" className="block text-sm font-medium text-gray-700 mb-2">
                        Type de sponsors recherchés
                      </label>
                      <input
                        type="text"
                        id="sponsorType"
                        name="sponsorType"
                        value={formData.sponsorType}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Ex: Équipementier, nutrition, technologie..."
                      />
                    </div>

                    <div>
                      <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
                        Montant cible recherché
                      </label>
                      <input
                        type="text"
                        id="targetAmount"
                        name="targetAmount"
                        value={formData.targetAmount}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Ex: 10 000€, 25 000€..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information (Read-only) */}
              <div className="border-t-2 border-slate-200 pt-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informations du compte
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </span>
                    <span className="text-slate-800 font-semibold">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Compte créé le
                    </span>
                    <span className="text-slate-800 font-semibold">
                      {userData?.createdAt 
                        ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Dernière connexion
                    </span>
                    <span className="text-slate-800 font-semibold">
                      {userData?.lastLoginAt 
                        ? new Date(userData.lastLoginAt.seconds * 1000).toLocaleString('fr-FR')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-4 pt-8 border-t-2 border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-8 py-3 text-sm font-bold text-slate-700 hover:text-slate-900 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Enregistrer
                      </>
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
