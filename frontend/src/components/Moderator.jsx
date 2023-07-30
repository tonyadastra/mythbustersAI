import { Avatar, Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { moderators } from "../data/moderators";
import { UserAvatar } from "./Avatar";
import React, { useState } from "react";
import SendIcon from '@mui/icons-material/Send';

export default function DebateModerator({ id, speaking, inSession, onStart, onPause, onAskQuestion, onClick }) {
    const moderator = moderators[id];
    const { name, image } = moderator;
    const [askQuestion, setAskQuestion] = useState(false); // [question, setQuestion
    const [question, setQuestion] = useState(null);

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
                    <Button variant="contained" color="info" onClick={() => { setAskQuestion(true) }}>
                        Ask Question
                    </Button>
                ) : (

                    <div className="ask-question">
                        <TextField id="outlined-basic" label="Question" variant="outlined" onChange={(e) => { setQuestion(e.target.value) }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <SendIcon onClick={() => { onAskQuestion(question) }} />
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