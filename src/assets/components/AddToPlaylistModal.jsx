import { useAuth } from '../context/authContext';
import { useUser } from '../context/userContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './AddToPlaylistModal.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddToPlaylistModal = ({ track, onClose }) => {
    const { user } = useAuth();
    const { userPlaylists, setUserPlaylists } = useUser();

    const handleAddToPlaylist = async ({ id, name }) => {
        try {
            const userRef = doc(db, "Utilisateurs", user.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            const playlistIndex = userData.playlists.findIndex((p) => p.id === id);
            const playlistName = userData.playlists[playlistIndex].name;

            if (playlistIndex !== -1) {
                const updatedPlaylists = [...userData.playlists];
                const playlist = updatedPlaylists[playlistIndex];

                // Vérifier si la chanson est déjà dans la playlist
                const isSongInPlaylist = playlist.songs && playlist.songs.some((song) => song.id === track.id);

                if (!isSongInPlaylist) {
                    if (!playlist.songs) {
                        playlist.songs = [];
                    }
                    const trackInfos = {
                        id: track.id,
                        title: track.title,
                        artist: {name:track.artist.name},
                        album: {
                            title:track.album.title, 
                            cover:track.album.cover,
                            cover_big:track.album.cover_big,
                            cover_medium:track.album.cover_medium,
                            cover_small:track.album.cover_small,
                            cover_xl:track.album.cover_xl,
                        },
                        preview: track.preview,
                    };
                    playlist.songs.push(trackInfos);

                    await updateDoc(userRef, {
                        playlists: updatedPlaylists,
                    });

                    setUserPlaylists(updatedPlaylists);
                    onClose();
                    playlistNotify(playlistName);
                } else {
                    onClose();
                    warnNotify(playlistName)
                }
            } else {
                console.error("Playlist non trouvée.");
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la chanson à la playlist: ", error);
            errorNotify(error, playlistName);
        }
    };
    
    const playlistNotify = (playlistName) => {
        toast.success(`${track.title} ajouté à ${playlistName}`, {
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
        toast.error(`Erreur lors de l'ajout de ${track.title} dans la playlist ${playlistName} : ${error} `, {
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

    const warnNotify = (playlistName) => {
        toast.warn(`${track.title} est déjà dans la playlist ${playlistName}`, {
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
                <h3 className="add-playlist">Ajouter à la playlist</h3>
                <div className="list-playlist">
                    {userPlaylists.length > 0 ? (
                        userPlaylists.map((playlist) => (
                            <button key={playlist.id} value={playlist.id} onClick={() => handleAddToPlaylist(playlist)}>
                                {playlist.name}
                            </button>
                        ))
                    ) : (
                        <p>Aucune playlist disponible</p>
                    )}
                </div>
                <button onClick={onClose} className="close-playlist">
                    <img src="/close.svg" alt="Fermer le pop-up" height="16px" />
                </button>
            </div>
        </div>
    );
    
};

export default AddToPlaylistModal;
