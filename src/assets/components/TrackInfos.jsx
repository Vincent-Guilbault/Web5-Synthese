import FavoriteButton from "../components/FavoriteButton";
import PlaylistButton from "../components/PlaylistButton";
import { usePlaybackContext } from '../context/playbackContext';
import "../components/TrackInfos.css";
import { motion } from "framer-motion";

import { IoPlaySharp } from "react-icons/io5";

const TrackInfos = ({ track, addToIsListening }) => {
  const { playTrack } = usePlaybackContext();
  const playTrackHandler = () => {
    playTrack(track);
    addToIsListening(track);
  };

  return (
    <motion.div initial={{ opacity: 0, x: -90 }}
    transition={{ duration: 0.2}}
    animate={{ opacity: 1, x: 0 }}
    className="informations">
      <img src={track.album.cover_medium} alt={`Cover de ${track.title}`} />
      <div className="texte">
        <h4>{track.title} - {track.artist.name}</h4>
        <h4>Album : {track.album.title}</h4>
        <h4>{track.release_date}</h4>
      </div>
      <div className="boutons">
        <button onClick={playTrackHandler}> <IoPlaySharp /> </button>
        <FavoriteButton track={track} />
        <PlaylistButton track={track} />
      </div>
      
      
    </motion.div>
  )
}

export default TrackInfos