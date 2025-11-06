// Services pour interagir avec les APIs Google (Calendrier et Contacts)

/**
 * Interface pour un événement de calendrier
 */
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}

/**
 * Interface pour un contact
 */
export interface Contact {
  resourceName: string;
  names?: Array<{
    displayName?: string;
    familyName?: string;
    givenName?: string;
  }>;
  emailAddresses?: Array<{
    value: string;
    type?: string;
  }>;
  phoneNumbers?: Array<{
    value: string;
    type?: string;
  }>;
  organizations?: Array<{
    name?: string;
    title?: string;
  }>;
}

/**
 * Récupérer les événements du calendrier Google
 */
export const getCalendarEvents = async (
  accessToken: string,
  maxResults: number = 50,
  timeMin?: Date
): Promise<CalendarEvent[]> => {
  try {
    const timeMinParam = timeMin ? timeMin.toISOString() : new Date().toISOString();
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `maxResults=${maxResults}&` +
      `timeMin=${timeMinParam}&` +
      `orderBy=startTime&` +
      `singleEvents=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API Calendar: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
};

/**
 * Récupérer tous les calendriers de l'utilisateur
 */
export const getCalendarList = async (accessToken: string) => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API Calendar List: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des calendriers:', error);
    throw error;
  }
};

/**
 * Récupérer les contacts Google
 */
export const getContacts = async (
  accessToken: string,
  pageSize: number = 100
): Promise<Contact[]> => {
  try {
    const response = await fetch(
      `https://people.googleapis.com/v1/people/me/connections?` +
      `pageSize=${pageSize}&` +
      `personFields=names,emailAddresses,phoneNumbers,organizations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API People: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.connections || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    throw error;
  }
};

/**
 * Récupérer les contacts avec pagination
 */
export const getAllContacts = async (accessToken: string): Promise<Contact[]> => {
  let allContacts: Contact[] = [];
  let pageToken: string | undefined;

  try {
    do {
      const url = pageToken
        ? `https://people.googleapis.com/v1/people/me/connections?` +
          `pageSize=100&` +
          `pageToken=${pageToken}&` +
          `personFields=names,emailAddresses,phoneNumbers,organizations`
        : `https://people.googleapis.com/v1/people/me/connections?` +
          `pageSize=100&` +
          `personFields=names,emailAddresses,phoneNumbers,organizations`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API People: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      allContacts = [...allContacts, ...(data.connections || [])];
      pageToken = data.nextPageToken;
    } while (pageToken);

    return allContacts;
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les contacts:', error);
    throw error;
  }
};

/**
 * Vérifier si les permissions sont toujours valides
 */
export const checkGooglePermissions = async (accessToken: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    // Vérifier que les scopes nécessaires sont présents
    const requiredScopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/contacts.readonly',
    ];

    const grantedScopes = data.scope?.split(' ') || [];
    
    return requiredScopes.every(scope => grantedScopes.includes(scope));
  } catch (error) {
    console.error('Erreur lors de la vérification des permissions:', error);
    return false;
  }
};

/**
 * Formater un événement de calendrier pour l'affichage
 */
export const formatCalendarEvent = (event: CalendarEvent) => {
  const startDate = event.start.dateTime 
    ? new Date(event.start.dateTime)
    : event.start.date 
    ? new Date(event.start.date)
    : null;

  const endDate = event.end.dateTime 
    ? new Date(event.end.dateTime)
    : event.end.date 
    ? new Date(event.end.date)
    : null;

  return {
    id: event.id,
    title: event.summary,
    description: event.description,
    start: startDate,
    end: endDate,
    location: event.location,
    attendees: event.attendees?.map(a => ({
      email: a.email,
      name: a.displayName,
    })) || [],
  };
};

/**
 * Formater un contact pour l'affichage
 */
export const formatContact = (contact: Contact) => {
  const name = contact.names?.[0];
  const email = contact.emailAddresses?.[0];
  const phone = contact.phoneNumbers?.[0];
  const organization = contact.organizations?.[0];

  return {
    id: contact.resourceName,
    displayName: name?.displayName || 'Sans nom',
    firstName: name?.givenName,
    lastName: name?.familyName,
    email: email?.value,
    emailType: email?.type,
    phone: phone?.value,
    phoneType: phone?.type,
    company: organization?.name,
    jobTitle: organization?.title,
  };
};
