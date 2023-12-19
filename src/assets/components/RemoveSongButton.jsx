import React, { useContext } from 'react';
import { useAuth } from '../context/authContext';
import { useUser } from '../context/userContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';


import {IoTrashSharp } from "react-icons/io5";

const RemoveSongButton = ({ playlist, song, onRemove }) => {
    const { user } = useAuth();
    const { setUserPlaylists } = useUser();

    const removeSongNotify = () => {
        toast.success(`"${song.title}" supprimée de ${playlist.name}`, {
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
        toast.error(`Erreur : ${error} `, {
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

    const handleRemoveSong = async () => {
        try {
            // Référence au document de l'utilisateur
            const userRef = doc(db, "Utilisateurs", user.uid);

            // Récupérer le document de l'utilisateur pour obtenir le tableau des playlists
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();

            // Trouver la playlist et la chanson à supprimer
            const playlistIndex = userData.playlists.findIndex(p => p.id === playlist.id);
            if (playlistIndex !== -1) {
                const updatedSongs = userData.playlists[playlistIndex].songs.filter(s => s.id !== song.id);

                // Créer une nouvelle copie des playlists avec la chanson supprimée
                const updatedPlaylists = [
                    ...userData.playlists.slice(0, playlistIndex),
                    { ...userData.playlists[playlistIndex], songs: updatedSongs },
                    ...userData.playlists.slice(playlistIndex + 1)
                ];

                // Mettre à jour le document utilisateur avec les nouvelles playlists
                await updateDoc(userRef, {
                    playlists: updatedPlaylists
                });

                // Mettre à jour l'état local
                setUserPlaylists(updatedPlaylists);

                onRemove(); // Appelée après la suppression réussie
                removeSongNotify(); // Afficher la notification après la suppression
            } else {
                throw new Error("Playlist non trouvée");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la chanson : ", error);
            errorNotify(error.message);
        }
    };

    return (
        <button onClick={handleRemoveSong}><IoTrashSharp /></button>
    );
};

export default RemoveSongButton;
