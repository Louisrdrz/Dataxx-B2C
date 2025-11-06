// Page de démonstration pour afficher les données Google (Calendrier et Contacts)
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCalendarEvents, useContacts, useCalendarList, useGoogleData } from '@/hooks/useGoogleData';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from 'next/router';

export default function GoogleDataPage() {
  const { firebaseUser: user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { accessToken, hasPermissions, isLoading: permissionsLoading } = useGoogleData();
  
  const [activeTab, setActiveTab] = useState<'calendar' | 'contacts' | 'calendars'>('calendar');
  
  // Hooks pour récupérer les données
  const { events, isLoading: eventsLoading, error: eventsError, refetch: refetchEvents } = useCalendarEvents(20);
  const { contacts, isLoading: contactsLoading, error: contactsError, refetch: refetchContacts } = useContacts(false);
  const { calendars, isLoading: calendarsLoading, error: calendarsError, refetch: refetchCalendars } = useCalendarList();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Le token sera automatiquement stocké et les données seront récupérées
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
    }
  };

  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accéder à vos données Google
          </h1>
          <p className="text-gray-600 mb-6">
            Connectez-vous avec Google pour accéder à vos calendriers et contacts
          </p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Se connecter avec Google
          </button>
        </div>
      </div>
    );
  }

  if (!hasPermissions || !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Permissions manquantes
          </h1>
          <p className="text-gray-600 mb-6">
            Veuillez vous reconnecter pour autoriser l'accès à vos calendriers et contacts
          </p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Autoriser l'accès
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vos données Google</h1>
              <p className="text-gray-600 mt-1">Accédez à vos calendriers et contacts</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'calendar'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📅 Événements
              </button>
              <button
                onClick={() => setActiveTab('calendars')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'calendars'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📆 Calendriers
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'contacts'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Contacts
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Événements du calendrier */}
          {activeTab === 'calendar' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Événements à venir</h2>
                <button
                  onClick={refetchEvents}
                  disabled={eventsLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {eventsLoading ? 'Chargement...' : 'Actualiser'}
                </button>
              </div>

              {eventsError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                  Erreur : {eventsError}
                </div>
              )}

              {eventsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des événements...</p>
                </div>
              ) : events.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun événement à venir</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        {event.start && (
                          <span>🕐 {event.start.toLocaleString('fr-FR')}</span>
                        )}
                        {event.location && (
                          <span>📍 {event.location}</span>
                        )}
                      </div>
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                          👥 {event.attendees.length} participant(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Liste des calendriers */}
          {activeTab === 'calendars' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Mes calendriers</h2>
                <button
                  onClick={refetchCalendars}
                  disabled={calendarsLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {calendarsLoading ? 'Chargement...' : 'Actualiser'}
                </button>
              </div>

              {calendarsError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                  Erreur : {calendarsError}
                </div>
              )}

              {calendarsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des calendriers...</p>
                </div>
              ) : calendars.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun calendrier trouvé</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {calendars.map((calendar) => (
                    <div key={calendar.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }}
                        ></div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{calendar.summary}</h3>
                          {calendar.description && (
                            <p className="text-sm text-gray-600">{calendar.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contacts */}
          {activeTab === 'contacts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Mes contacts</h2>
                <button
                  onClick={refetchContacts}
                  disabled={contactsLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {contactsLoading ? 'Chargement...' : 'Actualiser'}
                </button>
              </div>

              {contactsError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                  Erreur : {contactsError}
                </div>
              )}

              {contactsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des contacts...</p>
                </div>
              ) : contacts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun contact trouvé</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{contact.displayName}</h3>
                      {contact.email && (
                        <p className="text-sm text-gray-600 mt-1">📧 {contact.email}</p>
                      )}
                      {contact.phone && (
                        <p className="text-sm text-gray-600 mt-1">📱 {contact.phone}</p>
                      )}
                      {contact.company && (
                        <p className="text-sm text-gray-500 mt-1">🏢 {contact.company}</p>
                      )}
                      {contact.jobTitle && (
                        <p className="text-sm text-gray-500">💼 {contact.jobTitle}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
