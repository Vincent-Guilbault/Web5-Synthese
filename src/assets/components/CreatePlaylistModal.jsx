import { useState } from 'react';
import { useUser } from '../context/userContext'; // Assurez-vous d'importer useUser
import { useAuth } from '../context/authContext'; // Assurez-vous d'importer useAuth
import { db } from '../config/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePlaylistModal = ({ onClose, onPlaylistCreated }) => {
    const [playlistName, setPlaylistName] = useState('');
    const { userPlaylists, setUserPlaylists } = useUser(); // Utilisez useUser pour accéder aux données et méthodes liées à l'utilisateur
    const { user } = useAuth(); // Utilisez useAuth pour accéder aux données d'authentification
    const [isPublic, setIsPublic] = useState(true);

    const generateUniqueId = () => {
        return `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const handleCreatePlaylist = async (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire

        if (playlistName === '') {
            alert('Veuillez entrer un nom de playlist.');
            return;
        }

        // La nouvelle playlist à ajouter
        const newPlaylist = {
            id: generateUniqueId(), // Générer un ID unique pour la playlist
            name: playlistName, // Le nom de la playlist
            songs: [], // La playlist est vide au début
            isPublic: isPublic, // La playlist est publique par défaut
        };

        try {
            // Ici, on met à jour le document de l'utilisateur spécifique
            const userRef = doc(db, "Utilisateurs", user.uid); // user.uid doit être remplacé par l'ID de l'utilisateur authentifié
        
            // Utilisez arrayUnion pour ajouter la nouvelle playlist à la liste existante
            const updatedPlaylists = arrayUnion(newPlaylist)
        
            await updateDoc(userRef, {
                playlists: updatedPlaylists,
            });
        
            // Mettre à jour l'état local pour refléter le changement
            setUserPlaylists([...userPlaylists, newPlaylist]);

            // Appeler le rappel après la création réussie
            onPlaylistCreated(newPlaylist);
        
            onClose(); // Fermer le modal après la création
            playlistNotify(playlistName)
        } catch (error) {
            console.error("Erreur lors de l'ajout de la playlist: ", error);
            errorNotify(playlistName)
        }
    };

    const playlistNotify = (playlistName) => {
        toast.success(`Playlist ${playlistName} créée avec succès`, {
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

    const errorNotify = (error, playlistName) => {
        toast.error(`Erreur lors de la création de la playlist ${playlistName} : ${error} `, {
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
        <div className="modal-backdrop">
            <div className="modal-content">
                <form onSubmit={handleCreatePlaylist}>
                    <div className="wrap-user">
                        <input
                            type="text"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            placeholder="Nom de la playlist"
                        />
                        <label>
                            Publique
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={() => setIsPublic(!isPublic)}
                            />
                        </label>
                    </div>
                    
                    <div className="wrap-option">
                        <button type="submit">Créer Playlist</button>
                        <button type='button' onClick={onClose}>Fermer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;