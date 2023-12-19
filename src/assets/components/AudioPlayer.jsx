import { useEffect, useState } from "react";
import Progress from "./Progress";
import { Link } from "react-router-dom";
import { usePlaybackContext } from "../context/playbackContext";
import { useAudio } from "../../lib/audiotim";
import { useAuth } from "../context/authContext";

import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp, IoPlaySharp, IoPauseSharp, IoVolumeMediumSharp, IoVolumeMuteSharp } from "react-icons/io5";

const AudioPlayer = () => {
  const { currentTrack, setCurrentTrack, currentPlaylist, currentTrackIndex, prevTrack, nextTrack, setListeningStatus, clearListeningStatus } = usePlaybackContext();
  const [isPaused, setIsPaused] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const { user } = useAuth();

  const {
    isReady,
    volume,
    changeVolume,
    togglePause,
    stop
  } = useAudio(false);

  const svgIconStyle = {
    height: "16px",
  };

  const btnStyle = {
    border: "none",
    background: "none",
  };

  useEffect(() => {
    if (!user) {
      stop();
      setIsPaused(false);
      clearListeningStatus();
    } 
  }, [user, stop, currentTrack, setCurrentTrack, setIsPaused]);
  
  useEffect(() => {
    if (currentTrack) {
      togglePause()
      setIsPaused(true);
    } 
  }, []);

  if (!user) {
    return (
      <>
        {/* COMPOSANT QUAND PAS DE MUSIQUE */}
        <div>
          {/* IMG ALBUM */}
          <img
            src="https://placehold.co/56?text=Cover"
            alt="Placeholder"
          />
          {/* INFO TEXTE */}
          <span>Titre - Artiste</span>
        </div>
        <div>
          <button style={btnStyle} disabled>
            {isPaused ? (
              <img style={svgIconStyle} src="/play.svg" alt="Play" />
            ) : (
              <img style={svgIconStyle} src="/pause.svg" alt="Pause" />
            )}
          </button>
          <button style={btnStyle} disabled>
            <img style={svgIconStyle} src="/stop.svg" alt="Stop" />
          </button>
          {/* TEMPS COURANT DU VISIONNEMENT */}
          <span>0:00</span>
          {/* BARRE DE DÉFILEMENT DU VISIONNEMENT */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value="0"
            disabled
          />
          {/* BOUTON DE VOLUME */}
          <button style={btnStyle} disabled>
            {volume === 0 ? (
              <img style={svgIconStyle} src="/volume-xmark.svg" alt="Mute" />
            ) : (
              <img style={svgIconStyle} src="/volume-max.svg" alt="Max" />
            )}
          </button>
          {/* BARRE DE DÉFILEMENT DU VOLUME */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={previousVolume !== null && previousVolume !== undefined ? previousVolume : 1}
            onChange={(e) => setPreviousVolume(parseFloat(e.target.value))}
          />
        </div>
      </>
    );
  }
  
  const handlePlayPause = () => {
    togglePause();
    setIsPaused((prevIsPaused) => !prevIsPaused);
    clearListeningStatus();
    if(isPaused){
      setListeningStatus(currentTrack);
    }
  };

  const handlePrevious = () => {
    prevTrack(currentPlaylist, currentTrackIndex);
  };
  
  const handleNext = () => {
    nextTrack(currentPlaylist, currentTrackIndex);
  };
  
  const handleVolumeChange = (e) => {
    setPreviousVolume(volume);
    changeVolume(parseFloat(e.target.value));
  };

  const handleMute = () => {
    if (volume !== 0) {
      setPreviousVolume(volume);
      changeVolume(0);
    } else {
      changeVolume(previousVolume);
    }
  };

  return (
    <>
      <img src="/coin_gauche_gris.svg" alt="left_corner" className="left-gray-corner"/>
      <img src="/coin_droit_gris.svg" alt="right_corner" className="right-gray-corner"/>
      {currentTrack && isReady ? (
        <>
          {/* COMPOSANT QUAND MUSIQUE */}

          <div className="container-vinyl">
            <div className="vinyl">
              {/* IMG ALBUM */}
              <div className="wrap-img">
                <Link to={"/track/" + currentTrack.id}>
                  <img src={currentTrack.album.cover_medium} alt={currentTrack.title} />
                </Link>
              </div>
              
              {/* PROGRESS */}
              <div className="progress">
                {/* TEMPS COURRANT / DÉFILEMENT / TEMPS TOTAL */}
                <Progress />
              </div>
            </div>
          </div>


          {/* INFO & CONTROLE */}
          <div className="wrap-principal">
            <div className="wrap-info">
              {/* INFO TEXTE */}
              <span>
                <h2>{currentTrack.title}</h2> - <p>{currentTrack.artist.name}</p>
              </span>
            </div>

            <div className="wrap-controle">
              {/* BOUTTON PREV */}
              <button style={btnStyle} onClick={handlePrevious}>
                <IoPlaySkipBackSharp/>
                {/* <img style={svgIconStyle} src="/previous.svg" alt="Previous" /> */}
              </button>

              {/* BOUTTON PLAY / PAUSE */}
              <button style={btnStyle} onClick={handlePlayPause}>
                {isPaused ? (
                  <IoPlaySharp />
                  // <img style={svgIconStyle} src="/play.svg" alt="Play" />
                ) : (
                  <IoPauseSharp />
                  // <img style={svgIconStyle} src="/pause.svg" alt="Pause" />
                )}
              </button>

              {/* BOUTTON NEXT */}
              <button style={btnStyle} onClick={handleNext}>
                <IoPlaySkipForwardSharp />
                {/* <img style={svgIconStyle} src="/next.svg" alt="Next" /> */}
              </button>
            </div>
          </div>

          {/* VOLUME */}
          <div className="controle-volume">
            {/* BARRE CONTROLE VOLUME */}
            <input
              className="barre-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume !== null && volume !== undefined ? volume : 1}
              onChange={handleVolumeChange}
            />

            {/* BOUTTON MUTE */}
            <button style={btnStyle} onClick={handleMute} className="boutton-volume">
              {volume === 0 ? (
                <IoVolumeMuteSharp />
                // <img style={svgIconStyle} src="/volume-xmark.svg" alt="Mute" />
              ) : (
                <IoVolumeMediumSharp />
                // <img style={svgIconStyle} src="/volume-max.svg" alt="Max" />
              )}
            </button>

          </div>
        </>
      ) : (
        <>
          {/* COMPOSANT QUAND PAS DE MUSIQUE */}
          <div className="container-vinyl">
            <div className="vinyl">
              {/* IMG ALBUM */}
              <div className="wrap-img">
                <img src="/vinyl_mid.svg" alt="vinyl" />
              </div>
            </div>
          </div>
                {/* TEMPS COURRANT / DÉFILEMENT / TEMPS TOTAL */}
          <div className="wrap-principal">
            <div className="wrap-info">
              {/* INFO TEXTE */}
              <span>
                <h2>titre</h2> - <p>artiste</p>
              </span>
            </div>
          <div className="wrap-controle">
              {/* BOUTTON PREV */}
              <button style={btnStyle} onClick={handlePrevious}>
                <IoPlaySkipBackSharp/>
                {/* <img style={svgIconStyle} src="/previous.svg" alt="Previous" /> */}
              </button>

              {/* BOUTTON PLAY / PAUSE */}
              <button style={btnStyle} onClick={handlePlayPause}>
                {isPaused ? (
                  <IoPlaySharp />
                  // <img style={svgIconStyle} src="/play.svg" alt="Play" />
                ) : (
                  <IoPauseSharp />
                  // <img style={svgIconStyle} src="/pause.svg" alt="Pause" />
                )}
              </button>

              {/* BOUTTON NEXT */}
              <button style={btnStyle} onClick={handleNext}>
                <IoPlaySkipForwardSharp />
                {/* <img style={svgIconStyle} src="/next.svg" alt="Next" /> */}
              </button>
            </div>
          </div>
              


          <div className="controle-volume">
            {/* BOUTTON DE VOLUME */}
            <button style={btnStyle} disabled>
              {volume === 0 ? (
                <img style={svgIconStyle} src="/volume-xmark.svg" alt="Mute" />
              ) : (
                <img style={svgIconStyle} src="/volume-max.svg" alt="Max" />
              )}
            </button>
            {/* BARRE DE DÉFILEMENT DU VOLUME */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={previousVolume !== null && previousVolume !== undefined ? previousVolume : 1}
              onChange={(e) => setPreviousVolume(parseFloat(e.target.value))}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AudioPlayer;