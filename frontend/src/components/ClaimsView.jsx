import React from 'react';
import { Box, Typography, Avatar, CircularProgress, Tooltip } from '@mui/material';
import { CandidateScoreTracker } from './Scoreboard';
import { useTheme } from '@emotion/react';
import { UserAvatar } from './Avatar';
import { candidates } from '../data/candidates';
import Claim from './Claim';



export const Claims = ({ claims }) => {

  // search candidates by name
  // claims = claims.reverse();
  const reversedClaims = claims.slice().reverse();

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
            <Claim claim={claim} />)
        })}
      </Box>
    </Box>
  );
};

function getBgColor(claim) {
  if (claim.loading) return 'grey.300';
  if (claim.score < 0) return 'error.light';
  if (claim.score === 0) return 'warning.main';
  if (claim.score > 0 && claim.score < 1) return 'warning.light';
  return 'success.light';
}