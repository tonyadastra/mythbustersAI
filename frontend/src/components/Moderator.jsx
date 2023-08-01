import { Avatar, Box, Button, Autocomplete, IconButton, InputAdornment, TextField, CircularProgress } from "@mui/material";
import { moderators } from "../data/moderators";
import { UserAvatar } from "./Avatar";
import React, { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import AudioPlayer from "./Player";
import { debateQuestions } from '../data/questions';


export default function DebateModerator({ id, transcript, inSession, onStart, onPause, onAskQuestion, onClick, setCurrentIndex }) {
    const moderator = moderators[id];
    const { name, image } = moderator;
    const [askQuestion, setAskQuestion] = useState(false); // [question, setQuestion
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const speaking = !!transcript;

    React.useEffect(() => {
        // if user hits cancel key, reset question
        if (!askQuestion) return;
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                setAskQuestion(false);
            }
        });
    }, [askQuestion]);

    React.useEffect(() => {
        console.log(question);
    }, [question]);


    return (
        <Box className="moderator" onClick={onClick} >
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", }} gap={3}>
                <UserAvatar name={name} image={image} speaking={speaking} size={100} />
                <div className="moderator-info">
                    <h3>{name}</h3>
                    <p>Moderator</p>
                    {speaking &&
                        (<AudioPlayer
                            nextIndex={transcript.nextIndex}
                            setCurrentIndex={setCurrentIndex}
                            audio={transcript.audio} onFinish={transcript.onFinish}
                            audioPath={transcript.audioPath} />)}
                </div>
            </Box>
            <br />

            {/* moderator tools */}
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", }} gap={3}>
                <>
                    {!inSession
                        ? (
                            <Button variant="contained" color="success" onClick={onStart}>
                                Start
                            </Button>)
                        :
                        (
                            <Button variant="contained" color="error" onClick={onPause}>
                                Pause
                            </Button>
                        )}
                </>

                {/* {!askQuestion ? (
                    <Button variant="contained" color="info" onClick={() => {
                        setAskQuestion(true);
                    }}>
                        Ask Question
                    </Button>
                ) : (

                    <div className="ask-question" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <Autocomplete
                            disablePortal
                            id="question-box"
                            freeSolo
                            options={debateQuestions}
                            onChange={(index, obj) => {
                                setQuestion(obj.value);
                            }}
                            InputAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => {
                                        setLoading(true);
                                        try {
                                            const res = onAskQuestion(question);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                        finally {
                                            setLoading(false);
                                        }
                                    }}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            
                            sx={{ width: 300 }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    setLoading(true);
                                    try {
                                        const res = onAskQuestion(question);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                    finally {
                                        setLoading(false);
                                    }
                                }
                            }}

                            renderInput={(params) => <TextField
                                {...params}
                                id="outlined-basic" label="Question" variant="outlined"
                                style={{ width: '400px' }}
                                {...(loading && { disabled: true })}
                            />}

                        />

                        

                    </div>
                )} */}
                {/* <div className="moderator-tools">
                    <h3>Moderator Tools</h3>
                    <p>Fact Check</p>
                    <p>Timer</p>
                    <p>Chat</p>
                </div> */}
            </Box>
        </Box>
    );
}