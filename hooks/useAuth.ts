// Hook React pour gérer l'authentification
import { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase/auth';
import { createOrUpdateUserDocument, getUserData } from '@/lib/firebase/users';
import { User } from '@/types/firestore';

export const useAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setFirebaseUser(user);
      setLoading(true);
      setError(null);

      if (user) {
        try {
          // Créer ou mettre à jour le document utilisateur
          await createOrUpdateUserDocument(user);
          
          // Récupérer les données complètes de l'utilisateur
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (err) {
          console.error('Erreur lors de la récupération des données utilisateur:', err);
          setError(err as Error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  return {
    firebaseUser,
    userData,
    loading,
    error,
    isAuthenticated: !!firebaseUser,
  };
};
