import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../config/firebase';
import { getDoc, updateDoc, doc, arrayUnion, setDoc, increment } from 'firebase/firestore';

import { IoHeartSharp } from "react-icons/io5";

const FavoriteButton = ({ track }) => {
    const { user } = useContext(AuthContext);

    // Function to check if a track is in favorites
    const isTrackInFavorites = (favorites, track) => {
        for (let i = 0; i < favorites.length; i++) {
            if (favorites[i].id === track.id) {
                return true; // Track found in favorites
            }
        }
        return false; // Track not found in favorites
    };

    const handleAddToFavori = async () => {
        try {
            const userRef = doc(db, "Utilisateurs", user.uid);
            const userSnapshot = await getDoc(userRef);
            if (!userSnapshot.exists()) {
                console.error("No such document!");
                return;
            }
            const userData = userSnapshot.data();
    
            // Create a simplified version of the track object for the favorites array
            const trackForFavorites = {
                id: track.id,
                title: track.title,
                artist: { name: track.artist.name },
                album: {
                    title: track.album.title,
                    cover: track.album.cover,
                    cover_big: track.album.cover_big,
                    cover_medium: track.album.cover_medium,
                    cover_small: track.album.cover_small,
                    cover_xl: track.album.cover_xl,
                },
                preview: track.preview,
            };
    
            // Check if the track is already in favorites
            if (isTrackInFavorites(userData.favorites, track)) {
                warnNotify();
            } else {
                // Add the track to the user's favorites
                await updateDoc(userRef, {
                    favorites: arrayUnion(trackForFavorites),
                });
    
                // Update the TopSongs collection
                const topSongRef = doc(db, "TopSongs", track.id.toString());
                const topSongSnapshot = await getDoc(topSongRef);
    
                if (topSongSnapshot.exists()) {
                    // Increment the count if the document exists
                    await updateDoc(topSongRef, {
                        count: increment(1),
                    });
                } else {
                    // Create a new document if it doesn't exist
                    await setDoc(topSongRef, {
                        id: track.id,
                        title: track.title,
                        artist: { name: track.artist.name },
                        album: {
                            title: track.album.title,
                            cover: track.album.cover,
                            cover_big: track.album.cover_big,
                            cover_medium: track.album.cover_medium,
                            cover_small: track.album.cover_small,
                            cover_xl: track.album.cover_xl,
                        },
                        preview: track.preview,
                        count: 1,
                    });
                }
    
                favoriteNotify();
            }
        } catch (error) {
            console.error("Error adding to favorites: ", error);
            errorNotify(error);
        }
    };
    

    const favoriteNotify = () => {
        toast.success(`${track.title} ajouté aux ❤️`, {
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

    const warnNotify = () => {
        toast.warn(`${track.title} est déjà dans vos ❤️`, {
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
        <button onClick={handleAddToFavori}>
            <IoHeartSharp />
        </button>
    );
};

export default FavoriteButton;
