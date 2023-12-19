import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAudio, useAudioEnded } from "../../lib/audiotim";
import { db } from '../config/firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { useAuth } from "../context/authContext";

const playbackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentAudioSource, setCurrentAudioSource] = useState(null);
  const audio = useAudio();
  const { user } = useAuth();

  const endedCallback = () => {
    clearListeningStatus();
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % currentPlaylist.length);
  };

  useEffect(() => {
    if (currentPlaylist.length > 0) {
      const newSource = currentPlaylist[currentTrackIndex].preview;
      if (currentAudioSource !== newSource) {
        audio.changeSource(newSource);
        setCurrentAudioSource(newSource);
        incrementPlayCount(currentPlaylist[currentTrackIndex]);
        setCurrentTrack(currentPlaylist[currentTrackIndex]);
        setListeningStatus(currentPlaylist[currentTrackIndex]);
      }
    }
  }, [currentPlaylist, currentTrackIndex, audio, currentAudioSource]);

  useEffect(() => {
    if (currentPlaylist.length > 0) {
      audio.play();
    }
  }, [currentPlaylist, audio]);

  // Utilise le callback d'achèvement de lecture
  useAudioEnded(endedCallback);

  const playPlaylist = (playlist) => {
    setCurrentTrack(playlist[0]);
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
  };

  const playTrack = (track) => {
    playPlaylist([track]);
    setCurrentTrackIndex(0);
    setCurrentTrack(track);
    setListeningStatus(track);
  };

  const prevTrack = (playlist, currentIndex) => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  const nextTrack = (playlist, currentIndex) => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const playTrackFromPlaylist = (playlist, index) => {
    setCurrentPlaylist(playlist);
    setCurrentTrack(playlist[index]);
    setCurrentTrackIndex(index);
  };

  useEffect(() => {
    if (currentPlaylist.length > 0) {
      setListeningStatus(currentPlaylist[currentTrackIndex]);
    }
  }, [currentTrackIndex, currentPlaylist]);

  const incrementPlayCount = async (currentTrack) => {
    if (user && currentTrack) {
      const userRef = doc(db, "Utilisateurs", user.uid);
      const playCountPath = `ecoutes.${currentTrack.id}.playCount`;
      const titlePath = `ecoutes.${currentTrack.id}.title`;
      const artistPath = `ecoutes.${currentTrack.id}.artist`;
      const trackPath = `ecoutes.${currentTrack.id}.trackId`;
      await updateDoc(userRef, {
        [playCountPath]: increment(1),
        [titlePath]: currentTrack.title,
        [artistPath]: currentTrack.artist.name,
        [trackPath]: currentTrack.id,
      }).catch(error => {
        console.error("Erreur lors de la mise à jour du playCount :", error);
      });
    }
  };

  const setListeningStatus = async (track) => {
    if (user && track) {
      const userRef = doc(db, "Utilisateurs", user.uid);
      const isListeningPath = `isListening`;

      const listeningStatus = {
        trackId: track.id,
        title: track.title,
        artist: track.artist.name,
        albumCover: track.album.cover,
      };

      await setDoc(userRef, { [isListeningPath]: listeningStatus }, { merge: true })
        .then(() => console.log("Statut d'écoute mis à jour avec succès"))
        .catch((error) => console.error("Erreur lors de la mise à jour du statut d'écoute :", error));
    }
  };

  const clearListeningStatus = async () => {
    if (user) {
      const userRef = doc(db, "Utilisateurs", user.uid);
      const isListeningPath = `isListening`;

      // Set the listening status to an empty object to clear it
      await setDoc(userRef, { [isListeningPath]: {} }, { merge: true })
        .then(() => console.log("Statut d'écoute effacé avec succès"))
        .catch((error) => console.error("Erreur lors de l'effacement du statut d'écoute :", error));
    }
  };

  return (
    <playbackContext.Provider value={{ currentTrack, setCurrentTrack, currentPlaylist, playTrack, playPlaylist, playTrackFromPlaylist, prevTrack, nextTrack, setListeningStatus, clearListeningStatus }}>
      {children}
    </playbackContext.Provider>
  );
};

export const usePlaybackContext = () => {
  return useContext(playbackContext);
};
