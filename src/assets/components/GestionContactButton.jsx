import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GestionContactButton = ({ contactDetails }) => {
    const { user, setUser } = useAuth(); // Assurez-vous que useAuth renvoie setUser
    const [isContact, setIsContact] = useState(false);

    // Mettre à jour isContact lors du montage et chaque fois que user ou contactId change
    useEffect(() => {
        setIsContact(user?.contacts?.some(contact => contact.id === contactDetails.id));
    }, [user, contactDetails]);

    const updateContacts = useCallback((newContacts) => {
        setUser(prevUser => ({ ...prevUser, contacts: newContacts }));
    }, [setUser]);

    const handleAddContact = async () => {
        if (user) {
            try {
                const userRef = doc(db, "Utilisateurs", user.uid);
                const newContact = {
                    id: contactDetails.id, // L'identifiant du contact
                    displayName: contactDetails.displayName, // Le nom affiché du contact
                    email: contactDetails.email, // L'adresse email du contact
                    photoURL: contactDetails.photoURL, // L'URL de la photo de profil du contact
                    // ... ajoutez ici d'autres détails si nécessaire
                };
                await updateDoc(userRef, {
                    contacts: arrayUnion(newContact)
                });
                updateContacts([...user.contacts, newContact]);
                addContactNotify(newContact);
            } catch (error) {
                console.error("Erreur lors de l'ajout du contact :", error);
                errorNotify(error);
            }
        }
    };

    const handleRemoveContact = async () => {
        if (user) {
            try {
                const userRef = doc(db, "Utilisateurs", user.uid);
                // Trouver le contact dans le tableau
                const contactToRemove = user.contacts.find(contact => contact.id === contactDetails.id);
                await updateDoc(userRef, {
                    contacts: arrayRemove(contactToRemove)
                });
                removeContactNotify(contactToRemove);
                updateContacts(user.contacts.filter(contact => contact.id !== contactDetails.id));
            } catch (error) {
                errorNotify(error);
            }
        }
    };

    if (user && user.uid === contactDetails.id) {
        return null;
    }

    const addContactNotify = (newContact) => {
        toast.success(`${newContact.displayName} ajouté aux contacts`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    const removeContactNotify = (newContact) => {
        toast.success(`${newContact.displayName} enlevé aux contacts`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    const errorNotify = (error) => {
        toast.error(`Erreur lors de l'ajout de ${newContact.displayName} aux contacts : ${error} `, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    return (
        <>
            {isContact ? (
                <button onClick={handleRemoveContact}>Supprimer des contacts</button>
            ) : (
                <button onClick={handleAddContact}>Ajouter aux contacts</button>
            )}
        </>
    );
};

export default GestionContactButton;
