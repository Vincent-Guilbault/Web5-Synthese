import { useAudioVisual } from "../../lib/audiotim";
import { useEffect, useRef } from "react";

const AudioVisualizer = () => {
    const visualData = useAudioVisual();
    const visualizerRef = useRef(null);

    useEffect(() => {
        if (visualizerRef.current) {
            visualData.forEach((value, index) => {
                const bar = visualizerRef.current.children[index];
                if (bar) {
                    bar.style.height = `${value / 2}px`;
                }
            });
        }
    }, [visualData]);

    // Updated to handle color gradient variation
    const visualizerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        height: "25px",
        borderRadius: "5px",
        // padding: "5px",
        // margin: "32px 0 0 0"
    };

    // Générez les barres en fonction de la longueur du tableau visualData
    const bars = visualData.map((value, index) => {
        // Calculate gradient color dynamically between two hex codes
        const startColor = [104, 50, 95]; // RGB values for #68325F
        const endColor = [122, 0, 57]; // RGB values for #7A0039
        
        const gradientColor = `rgb(${Math.round(startColor[0] + (endColor[0] - startColor[0]) * index / (visualData.length - 1))},
                                    ${Math.round(startColor[1] + (endColor[1] - startColor[1]) * index / (visualData.length - 1))},
                                    ${Math.round(startColor[2] + (endColor[2] - startColor[2]) * index / (visualData.length - 1))})`;
        const barStyle = {
            width: `${100 / visualData.length}%`,
            backgroundColor: gradientColor,
            transition: "height 0.1s ease-in-out",
            height: `${value}px`,
        };

        return <div key={index} style={barStyle} />;
    });

    return (
        <div ref={visualizerRef} style={visualizerStyle} className="audio-visualizer">
            {bars}
        </div>
    );
};

export default AudioVisualizer;