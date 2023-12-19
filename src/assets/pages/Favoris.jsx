import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import RemoveSongButtonFavorite from '../components/RemoveSongButtonFavorite';
import { usePlaybackContext } from '../context/playbackContext';
import { Reorder } from 'framer-motion';
import ShareButton from '../components/ShareButton';

import "./Playlist.css"

import {IoPlaySharp, IoAddCircleSharp } from "react-icons/io5";

const Favoris = () => {
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const { playPlaylist, playTrackFromPlaylist, currentTrack } = usePlaybackContext();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (user) {
                const userRef = doc(db, "Utilisateurs", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    // Récupérer les favoris à partir du champ 'favorites' du document utilisateur
                    const userData = docSnap.data();
                    setFavorites(userData.favorites || []); // Utiliser un tableau vide comme valeur par défaut si aucun favori
                }
            }
        };

        fetchFavorites();
    }, [user]);

    const handleReorder = async (reorderedSongs) => {
        setFavorites(reorderedSongs);

        if (user) {
            const userRef = doc(db, "Utilisateurs", user.uid);

            // Mettre à jour directement le champ 'favorites' avec les chansons réorganisées
            await updateDoc(userRef, {
                favorites: reorderedSongs
            });
        }
    };

    const removeFromFavorites = (songToRemove) => {
        setFavorites(favorites.filter(song => song.id !== songToRemove.id));
    };

    const handleTrackPlay = (index) => {
        playTrackFromPlaylist(favorites, index);
    };

    const handlePlaylistPlay = () => {
        playPlaylist(favorites);
    };

    return (
        <div className="playlist">

            {/* NAME OF THE PLAYLIST AT THE TOP */}
            <div className="top-playlist">
                <span className="info-playlist">
                    <h2>Favoris</h2>
                    {/* <p className="qte-playlist">({favorites.songs.length})</p> */}
                    {favorites.isPublic && (
                        <ShareButton userId={user.uid} playlistName={favorites.name} playlistId={favorites.id}/>
                    )}
                </span>


                <button onClick={handlePlaylistPlay}><IoPlaySharp/></button>
            </div>
            
            <div className="playlist-music">
                {/* Affichage de la musique en cours */}
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

                {favorites.length > 0 ? (
                    <Reorder.Group axis="y" values={favorites} onReorder={handleReorder}>
                        {favorites.map((track, index) => (
                            <Reorder.Item key={track.id} value={track} style={{ color: currentTrack && track.id === currentTrack.id ? 'var(--cyan)' : 'var(--blanc)' }}>
                                <div className='item-playlist'>
                                    {/* IMG MUSIQUE */}
                                    <div onClick={() => handleTrackPlay(index)} className="img-musique">
                                        <img src={track.album.cover} alt={track.title} />
                                    </div>
                                    <div className="wrap-info">
                                        {/* NOM MUSIQUE */}
                                        <Link to={`/track/${track.id}`} className="nom-musique">
                                            <h2>{track.title}</h2>
                                        </Link>
                                        {/* NOM ARTISTE */}
                                        <p>{track.artist.name}</p>
                                    </div>
                                </div>
                                <RemoveSongButtonFavorite song={track} onRemove={() => removeFromFavorites(track)} />
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                ) : (
                    <p>Vous n'avez ajouté aucune musique à vos favoris.</p>
                )}
            </div>
        </div>
    );
};

export default Favoris;