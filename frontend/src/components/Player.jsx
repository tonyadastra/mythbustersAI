import React, { useState, useRef, useEffect, useContext } from 'react';
import DebateContext from '../contexts/DebateContext';
import api from '../api';
// import audio from '../assets/audio/output.mp3';
function AudioPlayer({ audio, nextIndex, setCurrentIndex, }) {
    const { transcripts, setTranscripts, claims, setClaims } = useContext(DebateContext); // [question, setQuestion
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

            setCurrentIndex(nextIndex);

            const currentTranscript = transcripts[nextIndex - 1];
            if (currentTranscript) {
                const claims = await api.post('/extract_claims', {
                    paragraph: currentTranscript.text,
                    speaker: currentTranscript.name,
                    opponent: currentTranscript.name === "Donald Trump" ? "Joe Biden" : "Donald Trump",
                    moderator: "Elon Musk"
                });
                setClaims(
                    claims.map(c => ({
                        ...c,
                        speaker_id: c.speaker === "Donald Trump" ? "trump" : "biden",
                        loading: true,
                    }))
                );
                console.log(claims);

                claims.forEach(async (claim, idx) => {
                    const { score, reason, unsure_flag } = await api.post('/fact_check', {
                        claim: claim.claim,
                        speaker: claim.speaker,
                        opponent: claim.opponent,
                        // moderator: claim.moderator,
                    });
                    console.log(score, reason, unsure_flag);

                    claims[idx].loading = false;
                    claims[idx].score = score;
                    claims[idx].reason = reason;
                    claims[idx].unsure_flag = unsure_flag;
                    claims[idx].speaker_id = claim.speaker === "Donald Trump" ? "trump" : "biden";
                    setClaims([...claims]);
                });
            }
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