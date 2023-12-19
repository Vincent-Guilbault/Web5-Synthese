import React, { useState } from 'react';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

import { MdPlaylistAdd } from "react-icons/md";

const PlaylistButton = ({ track }) => {

    const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    return (
        <>
            <button onClick={() => {
                setShowAddToPlaylistModal(true);
                setCurrentTrack(track);
            }}> <MdPlaylistAdd/></button>

            {showAddToPlaylistModal && (
                <AddToPlaylistModal
                    track={currentTrack}
                    onClose={() => {
                        setShowAddToPlaylistModal(false);
                    }}
                />
            )}
        </>
    )
}

export default PlaylistButton;