import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { Link, useParams } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import RemoveSongButton from '../components/RemoveSongButton';
import { Reorder } from 'framer-motion';
import { usePlaybackContext } from '../context/playbackContext';
import RemovePlaylistButton from '../components/RemovePlaylistButton';
import ShareButton from '../components/ShareButton';
import { motion } from 'framer-motion';

import "./Playlist.css"

import {IoPlaySharp, IoAddCircleSharp } from "react-icons/io5";

const Playlist = () => {
    const { user } = useContext(AuthContext);
    const { playPlaylist, playTrackFromPlaylist } = usePlaybackContext();
    const { currentTrack } = usePlaybackContext();
    const { playlistId } = useParams();
    const [playlistDetails, setPlaylistDetails] = useState(null);
    const [songs, setSongs] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);

    useEffect(() => {
        if (playlistDetails) {
            setSongs(playlistDetails.songs);
        }
    }, [playlistDetails]);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            if (user && playlistId) {
                const userRef = doc(db, "Utilisateurs", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    // Sauvegarde de toutes les playlists de l'utilisateur
                    setUserPlaylists(userData.playlists || []);
                    // Recherche de la playlist actuelle
                    const playlist = userData.playlists.find(p => p.id === playlistId);
                    if (playlist) {
                        setPlaylistDetails(playlist);
                    } else {
                        console.error("Aucune playlist trouvée avec l'ID: ", playlistId);
                    }
                }
            }
        };

        fetchPlaylistDetails();
    }, [user, playlistId]);

    const handleReorder = async (reorderedSongs) => {
        const updatedPlaylistDetails = {
            ...playlistDetails,
            songs: [...reorderedSongs]
        };
        setPlaylistDetails(updatedPlaylistDetails);
        setSongs([...reorderedSongs]);

        if (user && playlistId) {
            const userRef = doc(db, "Utilisateurs", user.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const updatedPlaylists = userData.playlists.map(p => {
                    if (p.id === playlistId) {
                        return {
                            ...p,
                            songs: reorderedSongs
                        };
                    }
                    return p;
                });

                await updateDoc(userRef, {
                    playlists: updatedPlaylists
                });
            }
        }
    };

    // Permet de mettre à jour la visibilité de la playlist
    const togglePlaylistVisibility = async (isPublic) => {
        if (user && playlistDetails) {
            const updatedPlaylist = {
                ...playlistDetails,
                isPublic: isPublic,
            };

            const updatedPlaylists = userPlaylists.map((p) =>
                p.id === playlistId ? updatedPlaylist : p
            );

            const userRef = doc(db, 'Utilisateurs', user.uid);
            try {
                await updateDoc(userRef, {
                    playlists: updatedPlaylists,
                });
                setPlaylistDetails(updatedPlaylist); // Mettre à jour l'état local
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la visibilité de la playlist:", error);
            }
        }
    };

    const handlePlaylistPlay = () => {
        playPlaylist(playlistDetails.songs);
    }

    const handleTrackPlay = (index) => {
        playTrackFromPlaylist(playlistDetails.songs, index);
    }
    
    const handleRemovePlaylist = () => {
        window.location.href = "/profil";
    };
    
    return (
        <motion.div className="playlist"
        initial={{ opacity: 0, x: -90 }}
        transition={{ duration: 0.2}}
        animate={{ opacity: 1, x: 0 }}>
            {playlistDetails ? (
                <>
                    {/* NAME OF THE PLAYLIST AT THE TOP */}
                    <div className="top-playlist">
                        <span className="info-playlist">
                            <h2 className="titre-playlist">{playlistDetails.name}</h2>
                            <p className="qte-playlist">({playlistDetails.songs.length})</p>
                            {playlistDetails.isPublic && (
                                <ShareButton userId={user.uid} playlistName={playlistDetails.name} playlistId={playlistDetails.id}/>
                            )}
                        </span>


                        <button onClick={handlePlaylistPlay}><IoPlaySharp/></button>
                    </div>

                    <div className="playlist-music">
                        {/* Musique en train de jouer */}
                        {currentTrack && (
                            <div className="affichage-currentTrack">
                                <div className="track-container">
                                    <Link to={`/track/${currentTrack.id}`}>
                                        <img src={currentTrack.album.cover_medium} alt={currentTrack.title} />
                                    </Link>
                                    <Link to={`/track/${currentTrack.id}`}>
                                        <h2>{currentTrack.title}</h2>
                                    </Link>
                                    <p>{currentTrack.artist.name}</p>
                                </div>
                            </div>
                        )}
                        
                        {playlistDetails.songs && playlistDetails.songs.length > 0 ? (
                            <Reorder.Group axis="y" values={songs} onReorder={handleReorder}>
                                    {playlistDetails.songs.map((song, index) => (
                                        <Reorder.Item key={song.id} value={song} style={{ color: currentTrack && song.id === currentTrack.id ? 'var(--cyan)' : 'var(--blanc)' }}>
                                                <div className="item-playlist">
                                                    {/* IMG MUSIQUE */}
                                                    <div onClick={() => handleTrackPlay(index)} className="img-musique">
                                                        <img src={song.album.cover} alt={song.title} />
                                                    </div>
                                                    <div className="wrap-info">
                                                        {/* NOM MUSIQUE */}
                                                        <Link to={`/track/${song.id}`} className="nom-musique">
                                                            <h2>{song.title}</h2>
                                                        </Link>
                                                        {/* NOM ARTISTE */}
                                                        <p>{song.artist.name}</p>
                                                    </div>
                                                </div>

                                                {/* BOUTTON POUBELLE REMOVE SONG */}
                                                <RemoveSongButton
                                                    playlist={playlistDetails}
                                                    song={song}
                                                    onRemove={() => {
                                                        setPlaylistDetails({
                                                            ...playlistDetails,
                                                            songs: playlistDetails.songs.filter((_, idx) => idx !== index)
                                                        });
                                                    }}
                                                />
                                        </Reorder.Item>
                                    ))}
                            </Reorder.Group>
                        ) : (
                            <div className="no-music">
                                <p>Il n'y a pas de chansons dans cette playlist.</p>
                                <Link to="/recherche" className="add-icon">
                                    <IoAddCircleSharp/>
                                </Link>
                            </div>
                        )}
                    </div>

                </>
            ) : (
                <p>Chargement des détails de la playlist...</p>
            )}
            {playlistDetails && (
                <div className="param-playlist">
                    <div className="visibilite">
                        <label>
                            Publique
                            <input
                                type="radio"
                                name="visibility"
                                checked={playlistDetails.isPublic}
                                onChange={() => togglePlaylistVisibility(true)}
                            />
                        </label>
                        <label>
                            Privée
                            <input
                                type="radio"
                                name="visibility"
                                checked={!playlistDetails.isPublic}
                                onChange={() => togglePlaylistVisibility(false)}
                            />
                        </label>
                    </div>
                    <RemovePlaylistButton
                        playlist={playlistDetails}
                        onRemove={handleRemovePlaylist}
                    />
                </div>
            )}
        </motion.div>
    );
    
};

export default Playlist;
