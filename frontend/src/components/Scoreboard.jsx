import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';


/* 
const claims = [
  {
    id: "candidate-1",
    claim: "I am the best president ever",
    speaker: "Donald Trump",
    speaker_id: "trump",
    time: 0,
    score: 1,
  },
  {
    id: "candidate-2",
    claim: "I am the best president ever",
    speaker: "Joe Biden",
    speaker_id: "biden",
    time: 0,
    score: 0.5,
  },
  {
    id: "candidate-2",
    claim: "I am the best president ever",
    speaker: "Joe Biden",
    speaker_id: "biden",
    loading: true,
  },
];
*/
export function CandidateScoreTracker({ claims }) {
    console.log(claims.filter(claim => claim.id === 'candidate-1' && claim.score > 0).length)
    const [candidate1Score, setCandidate1Score] = useState({
        truths: claims.filter(claim => claim.id === 'candidate-1' && claim.score > 0).reduce((acc, claim) => acc + claim.score, 0),
        lies: claims.filter(claim => claim.id === 'candidate-1' && claim.score < 0).reduce((acc, claim) => acc + Math.abs(claim.score), 0)
    });

    const [candidate2Score, setCandidate2Score] = useState({
        truths: claims.filter(claim => claim.id === 'candidate-2' && claim.score > 0).reduce((acc, claim) => acc + claim.score, 0),
        lies: claims.filter(claim => claim.id === 'candidate-2' && claim.score < 0).reduce((acc, claim) => acc + Math.abs(claim.score), 0)
    });

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1, p: 2 }}>
                <Typography variant="h4">{(candidate1Score.truths - candidate1Score.lies).toFixed(1)}</Typography>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ flex: 1, p: 1 }}>
                        <Typography variant="body1">{candidate1Score.truths.toFixed(1)}</Typography>
                        <Typography color="primary">Truths</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1 }}>
                        <Typography variant="body1">{candidate1Score.lies}</Typography>
                        <Typography color="error">Lies</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ flex: 0.5, p: 0 }} />

            <Box sx={{ flex: 1, p: 2 }}>
                <Typography variant="h4">{(candidate2Score.truths - candidate2Score.lies).toFixed(1)}</Typography>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ flex: 1, p: 1 }}>
                        <Typography variant="body1">{candidate2Score.truths.toFixed(1)}</Typography>
                        <Typography color="primary">Truths</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1 }}>
                        <Typography variant="body1">{candidate2Score.lies.toFixed(1)}</Typography>
                        <Typography color="error">Lies</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}