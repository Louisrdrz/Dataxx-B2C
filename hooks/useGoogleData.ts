// Hook personnalisé pour utiliser les APIs Google (Calendrier et Contacts)
import { useState, useEffect } from 'react';
import { getGoogleAccessToken } from '@/lib/firebase/auth';
import {
  getCalendarEvents,
  getCalendarList,
  getContacts,
  getAllContacts,
  checkGooglePermissions,
  formatCalendarEvent,
  formatContact,
  CalendarEvent,
  Contact,
} from '@/lib/firebase/googleApis';

export const useGoogleData = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getGoogleAccessToken();
    setAccessToken(token);

    if (token) {
      checkGooglePermissions(token).then(setHasPermissions);
    }
    
    setIsLoading(false);
  }, []);

  return {
    accessToken,
    hasPermissions,
    isLoading,
  };
};

export const useCalendarEvents = (maxResults: number = 50) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, hasPermissions } = useGoogleData();

  const fetchEvents = async () => {
    if (!accessToken || !hasPermissions) {
      setError('Pas de token d\'accès ou permissions insuffisantes');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedEvents = await getCalendarEvents(accessToken, maxResults);
      setEvents(fetchedEvents);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des événements');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && hasPermissions) {
      fetchEvents();
    }
  }, [accessToken, hasPermissions]);

  const formattedEvents = events.map(formatCalendarEvent);

  return {
    events: formattedEvents,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};

export const useContacts = (fetchAll: boolean = false) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, hasPermissions } = useGoogleData();

  const fetchContacts = async () => {
    if (!accessToken || !hasPermissions) {
      setError('Pas de token d\'accès ou permissions insuffisantes');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedContacts = fetchAll 
        ? await getAllContacts(accessToken)
        : await getContacts(accessToken);
      setContacts(fetchedContacts);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des contacts');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && hasPermissions) {
      fetchContacts();
    }
  }, [accessToken, hasPermissions]);

  const formattedContacts = contacts.map(formatContact);

  return {
    contacts: formattedContacts,
    isLoading,
    error,
    refetch: fetchContacts,
  };
};

export const useCalendarList = () => {
  const [calendars, setCalendars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, hasPermissions } = useGoogleData();

  const fetchCalendars = async () => {
    if (!accessToken || !hasPermissions) {
      setError('Pas de token d\'accès ou permissions insuffisantes');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedCalendars = await getCalendarList(accessToken);
      setCalendars(fetchedCalendars);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des calendriers');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && hasPermissions) {
      fetchCalendars();
    }
  }, [accessToken, hasPermissions]);

  return {
    calendars,
    isLoading,
    error,
    refetch: fetchCalendars,
  };
};
