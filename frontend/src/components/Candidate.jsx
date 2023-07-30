import { Avatar, Box } from "@mui/material";
import { styled } from "@mui/system";
import { candidates } from "../data/candidates";
import podiumSvg from "../assets/podium.svg";
import { useTheme } from "@emotion/react";
import { UserAvatar } from "./Avatar";
import AudioPlayer from "./Player";

import audio from '../assets/audio/output.mp3';


// const useStyles = styled()((theme) => ({
//     avatarActive: {
//         //   backgroundColor: theme.palette.grey[50],
//         border: `2px solid ${theme.palette.info.main}`,
//         //   color: theme.palette.info.main,
//     },
// }));


export const DebateCandidate = ({ id, transcript, currentTranscripts, onClick, setCurrentIndex }) => {
    const candidate = candidates[id];
    const speaking = !!transcript;
    const { name, party, image } = candidate;

    return (
        <Box className="candidate" onClick={onClick} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <UserAvatar name={name} image={image} speaking={speaking} size={100} />
            <img src={podiumSvg} alt="podium"
                style={{ width: "100px", height: "100px" }} />
            <div className="candidate-info">
                <h3>{name}</h3>
                <p>{party}</p>
            </div>

            {transcript &&
                <AudioPlayer
                    audio={transcript.audio}
                    setCurrentIndex={setCurrentIndex}
                    currentTranscripts={currentTranscripts}
                    onFinish={transcript.onFinish}
                    nextIndex={transcript.nextIndex}
                    audioPath={transcript.audioPath}
                />
            }
        </Box>
    );
}
