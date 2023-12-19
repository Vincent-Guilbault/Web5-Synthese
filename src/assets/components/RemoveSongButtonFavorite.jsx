import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc, updateDoc, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

import {IoTrashSharp } from "react-icons/io5";

const RemoveSongButtonFavorite = ({ song, onRemove }) => {
    const { user } = useAuth();

    const removeSongNotify = () => {
        toast.success(`"${song.title}" supprimée des ❤️`, {
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

    const handleRemoveFromFavorites = async () => {
        try {
            // Supprimer la chanson des favoris de l'utilisateur
            const userRef = doc(db, "Utilisateurs", user.uid);
            await updateDoc(userRef, {
                favorites: arrayRemove(song)
            });

            // Mettre à jour le compteur de favoris dans la collection TopSongs
            const topSongRef = doc(db, "TopSongs", song.id.toString());
            const topSongSnapshot = await getDoc(topSongRef);

            if (topSongSnapshot.exists()) {
                // Increment the count if the document exists
                await updateDoc(topSongRef, {
                    count: increment(-1),
                });
            }

            onRemove(); // Appeler onRemove sans argument
            removeSongNotify();
        } catch (error) {
            console.error("Erreur lors de la suppression de la chanson des favoris : ", error);
            errorNotify(error.message);
        }
    };

    return (
        <button onClick={handleRemoveFromFavorites}> <IoTrashSharp /> </button>
    );
};

export default RemoveSongButtonFavorite;
