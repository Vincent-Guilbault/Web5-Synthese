import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, provider } from '../config/firebase';
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../config/firebase';

// Création du contexte d'authentification
const AuthContext = createContext({
    signInWithGoogle: async () => { },
    logout: async () => { },
    user: null,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  //     if (firebaseUser) {
  //       setUser(firebaseUser);
  //     } else {
  //       setUser(null);
  //     }
  //     setLoading(false); // Une fois que l'utilisateur est récupéré, on arrête de charger
  //   });
  //   return () => unsubscribe();
  // }, []);

  // Modification du useEffect pour récupérer les données de Firestore et les combiner 
  // avec les données d'authentification afin de pouvoir ajouter et supprimer des contacts.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Récupération des données de l'utilisateur dans Firestore
        const userRef = doc(db, "Utilisateurs", firebaseUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          // Combiner les données d'authentification avec les données de Firestore
          setUser({
            ...firebaseUser, // Données de l'authentification Firebase
            ...docSnap.data(), // Données supplémentaires de Firestore
          });
        } else {
          // Si l'utilisateur n'a pas de document dans Firestore, initialisez-le
          await setDoc(userRef, {
            contacts: [],
            playlists: [],
            favorites: [],
            displayName: firebaseUser.displayName.toLowerCase() || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
          });
          setUser({
            ...firebaseUser,
            contacts: [],
            playlists: [],
            favorites: [],
            displayName: firebaseUser.displayName.toLowerCase() || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Fonction pour se connecter via Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // Fonction pour se déconnecter
  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    signInWithGoogle,
    logout,
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Chargement...</div> : children}
    </AuthContext.Provider>
  );

};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
