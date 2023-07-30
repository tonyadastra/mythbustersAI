import { Avatar, Box, Button, IconButton, InputAdornment, TextField, CircularProgress } from "@mui/material";
import { moderators } from "../data/moderators";
import { UserAvatar } from "./Avatar";
import React, { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import AudioPlayer from "./Player";

export default function DebateModerator({ id, transcript, inSession, onStart, onPause, onAskQuestion, onClick }) {
    const moderator = moderators[id];
    const { name, image } = moderator;
    const [askQuestion, setAskQuestion] = useState(false); // [question, setQuestion
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
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


    return (
        <Box className="moderator" onClick={onClick} >
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", }} gap={3}>
                <UserAvatar name={name} image={image} speaking={speaking} size={100} />
                <div className="moderator-info">
                    <h3>{name}</h3>
                    <p>Moderator</p>
                    {speaking &&
                        (<AudioPlayer audio={transcript.audio} onFinish={transcript.onFinish} />)}
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

                {!askQuestion ? (
                    <Button variant="contained" color="info" onClick={() => {
                        setAskQuestion(true);
                    }}>
                        Ask Question
                    </Button>
                ) : (

                    <div className="ask-question">
                        <TextField id="outlined-basic" label="Question" variant="outlined" onChange={(e) => { setQuestion(e.target.value) }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            {loading
                                                ? <CircularProgress size={15} />
                                                : <SendIcon onClick={async () => {
                                                    setLoading(true);
                                                    try {
                                                        const res = await onAskQuestion(question);
                                                    } catch (e) {
                                                        console.log(e);
                                                    }
                                                    finally {
                                                        setLoading(false);
                                                    }
                                                }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </div>
                )}
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