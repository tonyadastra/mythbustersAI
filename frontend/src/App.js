import logo from "./logo.svg";
import "./App.css";
import { Box, Grid, ThemeProvider, Typography } from "@mui/material";
import { DebateCandidate } from "./components/Candidate";
import DebateModerator from "./components/Moderator";
import React from "react";
import sampleClaims from "./data/claims";
import { Claims } from "./components/ClaimsView";
import api from "./api";
import AudioPlayer from "./components/Player";

function App() {
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [claims, setClaims] = React.useState(sampleClaims);
  const [inSession, setInSession] = React.useState(false);

  const askQuestion = async (question) => {
    const res = await api.post("/question", { question });
    console.log(res);
  };

  const start = async () => {
    setInSession(true);
    // const res = await api.post("/start");
  }

  return (
    <ThemeProvider theme>
      <div className="App">
        <Typography variant="h3" component="h3" gutterBottom>
          Live 2024 Presidential Debate
        </Typography>

        {/* <CandidateScoreTracker /> */}

        <br />
        <br />

        <Grid container spacing={2}>
          {/* <Grid item xs={1} /> */}
          <Grid item xs={4} alignItems="center">
            <DebateCandidate id="trump" speaking />
            
          </Grid>
          <Grid item xs={4}>
            <Claims claims={claims} />
          </Grid>
          <Grid item xs={4} alignItems="center">
            <DebateCandidate id="biden" />
          </Grid>
        </Grid>
        {/* <Grid item xs={1} /> */}
      </div>

      <br />
      <Box>
        <DebateModerator
          id="elon"
          inSession={inSession}
          onStart={() => {
            setInSession(true);
          }}
          onPause={() => {
            setInSession(false);
          }}
          onAskQuestion={askQuestion}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
