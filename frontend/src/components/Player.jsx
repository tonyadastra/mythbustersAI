import React, { useState, useRef, useEffect } from 'react';
// import audio from '../assets/audio/output.mp3';
function AudioPlayer({ audio, nextIndex, setCurrentIndex }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
        audioRef.current.onended = async function () {
            setIsPlaying(false);
            console.log('audio ended')
            // if (onFinish) {
            //     await onFinish();
            // }
            setCurrentIndex(nextIndex);
        }
    }, [isPlaying]);


    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    if (!audio) return null;
    return (
        <div>
            <audio ref={audioRef} src={'data:audio/mpeg;base64,' + audio} autoPlay />
            {/* <source src={'data:audio/mpeg;base64,' + audio} />
            </audio> */}
            <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    );
}

export default AudioPlayer;