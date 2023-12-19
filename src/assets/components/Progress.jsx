import { useAudio, useAudioProgress } from "../../lib/audiotim";
import { useState } from 'react';

import {
	CircularInput,
	CircularTrack,
	CircularProgress,
	CircularThumb,
    useCircularInputContext,
} from 'react-circular-input'

const Progress = () => {
    const { progress, changeProgress } = useAudioProgress();
    const { duration } = useAudio(false);
    const [showTotalTime, setShowTotalTime] = useState(true);

    const toggleTimeDisplay = () => {
        setShowTotalTime(!showTotalTime);
    };

    return (
        <>
            <span className="temps-courrant">
                0:{(Math.round(progress * duration) < 10 ? '0' : '') + Math.round(progress * duration)}
            </span>

            <CircularInput
                value={progress}
                onChange={(value) => changeProgress(value)}

                // TRUC QUI DEVAIT ETRE ENLEVER POUR LE CIRCULAR INPUT
                // type="range"
                // min="0"
                // max="1"
                // step="0.01"
                // onChange={(e) => changeProgress(parseFloat(e.target.value))}
            >
                <CircularTrack strokeWidth={5} stroke="white" className="custom-track"/>
                <CircularProgress r={10} strokeWidth={5} stroke="#3E8E93" className="custom-progress"/>
                <CircularThumb r={10} fill="#3E8E93" className="custom-thumb"/>
            </CircularInput>

            <span onClick={toggleTimeDisplay} className="temps-restant">
                {showTotalTime ? "" : "-"}0:{showTotalTime ? (Math.round(duration)) : (Math.round((1 - progress) * duration))}
            </span>
        </>
    );
}

export default Progress;