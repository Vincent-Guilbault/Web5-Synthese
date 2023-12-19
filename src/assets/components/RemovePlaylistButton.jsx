import React from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../config/firebase';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RemovePlaylistButton = ({ playlist, onPlaylistDeleted }) => {
  const { user } = useAuth();

  const handleRemovePlaylist = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la playlist ${playlist.name} ?`)) {
      try {
        const userRef = doc(db, "Utilisateurs", user.uid);
        await updateDoc(userRef, {
          playlists: arrayRemove(playlist)
        });
        playlistNotify(playlist.name);
        onPlaylistDeleted(playlist)
      } catch (error) {
        console.error("Erreur lors de la suppression de la playlist : ", error);
        errorNotify(error, playlist.name);
      }
    }
  };

  const playlistNotify = (playlistName) => {
    notify(`Playlist ${playlistName} supprimé`, 'success');
  };

  const errorNotify = (error, playlistName) => {
    notify(`Erreur lors de la suppression de la playlist ${playlistName} : ${error}`, 'error');
  };

  const notify = (message, type) => {
    toast[type](message, {
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
    <button onClick={handleRemovePlaylist}>Supprimer la playlist</button>
  );
};

export default RemovePlaylistButton;
