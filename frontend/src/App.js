import logo from "./logo.svg";
import "./App.css";
import { Box, Grid, Hidden, ThemeProvider, Typography } from "@mui/material";
import { DebateCandidate } from "./components/Candidate";
import DebateModerator from "./components/Moderator";
import React from "react";
import sampleClaims from "./data/claims";
import { Claims } from "./components/ClaimsView";
import api from "./api";
import AudioPlayer from "./components/Player";
import { debateScript } from "./data/debate-script";
import DebateContext from "./contexts/DebateContext";
// import sampleAudio from './assets/audio/output.mp3'

function App() {
  const {
    transcripts,
    setTranscripts,
    claims,
    setClaims,
    inSession,
    setInSession,
  } = React.useContext(DebateContext);
  // const [currentIndex, setCurrentIndex] = React.useState(-1);
  // const [transcripts, settranscripts] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // const [claims, setClaims] = React.useState([]);
  // const [inSession, setInSession] = React.useState(false);

  // const currentTranscript = React.useMemo(() => {
  //   return transcripts[currentIndex];
  // }, [transcripts, currentIndex]);

  const askQuestion = async (question) => {
    setTranscripts([]);

    const res = await api.post("/generate", { question });
    console.log(res);

    /*
{
    "elon_musk_question": " What policies would you implement to help grow the economy and create jobs? ",
    "joe_biden_answer": "We're going to invest in American workers and American ingenuity. We need to build infrastructure like roads, bridges, universal broadband. We'll lower taxes for the middle class and make corporations pay their fair share. And I'll fight against outsourcing and make sure more products are stamped Made in America.",
    "donald_trump_answer": "We're going to cut taxes massively and unleash the power of the American economy. We need to eliminate burdensome regulations that are stifling small businesses. I'll    \nrenegotiate bad trade deals and bring jobs back from China. And we'll invest in job training so Americans have the skills they need.",
    "joe_biden_rebuttal": "While cutting some taxes may provide a short-term boost, we can't afford to add more to the deficit. The real way to grow the economy is to invest in working families or they'll continue to fall behind.",
    "donald_trump_rebuttal": "Lowering taxes and cutting regulations is the proven recipe for job creation and economic growth. We just need to get government out of the way and let the American people and American businesses do what they do best."
}
    */

    // setInSession(true);
    // setCurrentIndex(0);

    const {
      elon_musk_question,
      joe_biden_answer,
      donald_trump_answer,
      joe_biden_rebuttal,
      donald_trump_rebuttal,
    } = res;
    // for each answer, generate audio

    [
      elon_musk_question,
      joe_biden_answer,
      donald_trump_answer,
      joe_biden_rebuttal,
      donald_trump_rebuttal,
    ].forEach(async (text, i) => {
      const role = i === 0 ? "elon" : i % 2 === 1 ? "biden" : "trump";
      const res = await api.post("/text-to-speech", {
        role: role,
        transcript: text,
        stream: false,
      });
      const { audio_bytes } = res;
      console.log(
        joe_biden_answer,
        donald_trump_answer,
        joe_biden_rebuttal,
        donald_trump_rebuttal
      );
      // make sure that it's in order of moderator, biden, trump, biden, trump

      const new_transcript = {
        role: role === "elon" ? "moderator" : "candidate-" + ((i % 2) + 1),
        name:
          role === "elon"
            ? "Elon Musk"
            : role === "biden"
            ? "Joe Biden"
            : "Donald Trump",
        text,
        // category: "economy",
        question: elon_musk_question,
        audio: audio_bytes,
        nextIndex: i + 1,
      };

      setTranscripts((transcripts) => {
        const newTranscripts = [...transcripts];
        newTranscripts[i] = new_transcript;
        return newTranscripts;
      });
    });
    setCurrentIndex(0);
    setInSession(true);
    return res;
  };

  React.useEffect(() => {
    console.log(transcripts);
  }, [transcripts]);

  const start = async () => {
    setInSession(true);
    setCurrentIndex(0);
    setTranscripts(debateScript);
  };

  // React.useEffect(() => {
  //   if (inSession) {
  //     const currentTranscript = transcripts[currentIndex];
  //     if (currentTranscript) {
  //       currentTranscript.onFinish();
  //     }
  //   }
  // }, [currentIndex, transcripts, inSession]);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        color: "text.primary",
      }}
    >
      <div className="App">
        <Typography variant="h4" component="h3" gutterBottom>
          Mythbusters AI - Live 2024 Presidential Debate
        </Typography>

        <Typography gutterBottom>
          Live fact-checking - powered by Eleven Labs & Claude.
        </Typography>

        <br />

        {/* <CandidateScoreTracker /> */}

        <br />
        <br />

        <Grid container spacing={2}>
          {/* <Grid item xs={1} /> */}

          <Grid item xs={6} md={4} alignItems="center">
            <DebateCandidate
              id="trump"
              setCurrentIndex={setCurrentIndex}
              transcript={
                transcripts[currentIndex]?.role === "candidate-1"
                  ? transcripts[currentIndex]
                  : null
              }
            />
          </Grid>
          <Hidden only={["xs", "sm"]}>
            <Grid item md={4}>
              <Claims claims={claims} />
            </Grid>
          </Hidden>
          <Grid item xs={6} md={4} alignItems="center">
            <DebateCandidate
              id="biden"
              setCurrentIndex={setCurrentIndex}
              transcript={
                transcripts[currentIndex]?.role === "candidate-2"
                  ? transcripts[currentIndex]
                  : null
              }
            />
          </Grid>
        </Grid>
        {/* <Grid item xs={1} /> */}
        <br />
        <Box>
          <DebateModerator
            id="elon"
            inSession={inSession}
            setCurrentIndex={setCurrentIndex}
            transcript={
              transcripts[currentIndex]?.role === "moderator"
                ? transcripts[currentIndex]
                : null
            }
            onStart={start}
            onPause={() => {
              setInSession(false);
            }}
            onAskQuestion={askQuestion}
          />
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid
            item
            xs={12}
            sx={{ display: { xs: "block", md: "none" } }}
            alignItems="center"
          >
            <Claims claims={claims} />
          </Grid>
        </Grid>
      </div>

      <br />
    </Box>
  );
}

export default App;
