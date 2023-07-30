import React, { useState, useRef, useEffect } from 'react';
// import audio from '../assets/audio/output.mp3';
function AudioPlayer({ audio }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    if (!audio) return null;
    return (
        <div>
            <audio ref={audioRef} src={audio} />
            <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    );
}

export default AudioPlayer;