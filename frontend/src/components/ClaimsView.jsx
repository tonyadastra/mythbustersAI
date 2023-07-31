import React from 'react';
import { Box, Typography, Avatar, CircularProgress, Tooltip } from '@mui/material';
import { CandidateScoreTracker } from './Scoreboard';
import { useTheme } from '@emotion/react';
import { UserAvatar } from './Avatar';
import { candidates } from '../data/candidates';
import Claim from './Claim';
import DebateContext from '../contexts/DebateContext';



export const Claims = ({ claims }) => {
  const { setClaims } = React.useContext(DebateContext);
  const reversedClaims = claims.slice().reverse().filter(
    claim => claim.claim
  );


  // setClaims(uniqueClaims);


  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', marginTop: -5,
    }}>

      <CandidateScoreTracker claims={claims} />

      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: .5,
        minHeight: '40vh',
        maxHeight: '40vh', overflowY: 'scroll', overflowX: 'hidden'
      }}>
        {reversedClaims.map((claim, idx) => {
          return (
            <Claim claim={claim} />
          )
        })}
      </Box>
    </Box>
  );
};
