import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, collection } from "firebase/firestore";

const UserContext = createContext({
  userPlaylists: [],
  userFavorites: [],
  userContacts: [],
  displayName: '',
  email: '',
  photoURL: '',
  // ajoutez des fonctions pour gérer ces états comme addUserPlaylist, removeUserPlaylist, etc.
});

const UserProvider = ({ children }) => {
  const { user } = useAuth(); // Utilisez useAuth pour accéder aux données d'authentification
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userContacts, setUserContacts] = useState([]);

  useEffect(() => {
    const fetchOrInitializeUser = async () => {
      if (user) {
        try {
          const userRef = doc(db, "Utilisateurs", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            // L'utilisateur existe déjà, récupérez ses données
            const userData = userSnap.data();
            setUserPlaylists(userData.playlists || []);
            setUserFavorites(userData.favorites || []);
            setUserContacts(userData.contacts || []);
          } else {
            // L'utilisateur se connecte pour la première fois, initialisez ses données
            await setDoc(userRef, {
              playlists: [],
              favorites: [],
              contacts: [],
              displayName: user.displayName.toLowerCase() || '',
              email: user.email || '',
              photoURL: user.photoURL || '',
            });
          }
        } catch (error) {
          console.error("Erreur lors de la récupération ou de la création de l'utilisateur:", error);
        }
      }
    };

    fetchOrInitializeUser();
  }, [user]);

  const updateUserProfile = async (updatedProfile) => {
    if (user) {
      try {
        const userRef = doc(db, "Utilisateurs", user.uid);
        await updateDoc(userRef, {
          displayName: updatedProfile.displayName.toLowerCase(),
          // Mettez à jour les autres champs si nécessaire...
        });
        // Mettez à jour l'état local si nécessaire...
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil de l'utilisateur:", error);
      }
    }
  };

  const value = {
    userPlaylists,
    setUserPlaylists,
    userFavorites,
    setUserFavorites,
    userContacts,
    setUserContacts,
    updateUserProfile,
    // ajoutez des fonctions pour gérer ces états
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { UserContext, UserProvider, useUser };
