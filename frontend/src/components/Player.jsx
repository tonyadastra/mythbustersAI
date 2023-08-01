import React, { useState, useRef, useEffect, useContext } from 'react';
import DebateContext from '../contexts/DebateContext';
import api from '../api';
// import audio from '../assets/audio/output.mp3';
function AudioPlayer({ audio, nextIndex, setCurrentIndex, audioPath = null }) {
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
            if (currentTranscript && currentTranscript.role !== "moderator") {
                const latest_claims = await api.post('/extract_claims', {
                    paragraph: currentTranscript.text,
                    speaker: currentTranscript.name,
                    opponent: currentTranscript.name === "Donald Trump" ? "Joe Biden" : "Donald Trump",
                    moderator: "Elon Musk"
                });

                let newClaims = latest_claims.map(c => ({
                    ...c,
                    speaker_id: c.speaker === "Donald Trump" ? "trump" : "biden",
                    loading: true,
                    id: c.speaker === "Donald Trump" ? "candidate-1" : "candidate-2",
                }));
                newClaims = newClaims.filter(c => !claims.some(p => p.claim === c.claim && p.speaker === c.speaker));

                setClaims(
                    (prev) => [...prev, ...newClaims]
                );
                console.log(newClaims);


                newClaims.forEach(async (claim, idx) => {
                    try {
                        const { score, reason, unsure_flag, speaker, references } = await api.post('/fact_check', {
                            claim: claim.claim,
                            speaker: claim.speaker,
                            opponent: claim.opponent,
                            // moderator: claim.moderator,
                        });
                        console.log(score, reason, unsure_flag);

                        newClaims[idx].id = claim.id;
                        newClaims[idx].loading = false;
                        newClaims[idx].score = score;
                        newClaims[idx].reason = reason;
                        newClaims[idx].unsure_flag = unsure_flag;
                        newClaims[idx].speaker_id = speaker === "Donald Trump" ? "trump" : "biden";
                        newClaims[idx].references = references;

                        // console.log(newClaims)

                        // const updatedClaims = [...claims, ...newClaims];
                        
                        // // filter out duplicates
                        // const uniqueClaims = updatedClaims.filter((claim, idx, self) =>
                        //     idx === self.findIndex((c) => (
                        //         c.claim === claim.claim && c.speaker === claim.speaker
                        //     ))
                        // );
                        setClaims((prev) => [...prev.filter(c => c.claim !== claim.claim), ...newClaims]);

                        // setClaims((prev) => [...prev, ...newClaims]);
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }
    }, [isPlaying]);


    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    if (!audio && !audioPath) return null;
    return (
        <div>
            <audio ref={audioRef} src={
                audioPath ? audioPath : 'data:audio/mpeg;base64,' + audio} autoPlay />
            {/* <source src={'data:audio/mpeg;base64,' + audio} />
            </audio> */}
            <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    );
}

export default AudioPlayer;