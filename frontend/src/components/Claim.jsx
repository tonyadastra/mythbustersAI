import React from 'react';
import { Box, Typography, Avatar, CircularProgress, Tooltip } from '@mui/material';
import { CandidateScoreTracker } from './Scoreboard';
import { UserAvatar } from './Avatar';
import { candidates } from '../data/candidates';

export default function Claim({ claim, idx }) {
    const [toggleReason, setToggleReason] = React.useState(false);
    // console.log(claim, claim.speaker_id);
    const { image } = candidates[claim.speaker_id];
    const isLeft = claim.id === 'candidate-1';
    const bgColor = getBgColor(claim);

    return (
        <Box
            key={claim.id}
            sx={{
                display: 'flex',
                alignItems: 'center',
                ...(isLeft ? { marginRight: 'auto' } : { marginLeft: 'auto' }),
            }}
        >
            <Box
                gap={2}
                sx={{
                    backgroundColor: bgColor,
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                }}
            >
                {isLeft ? (
                    <UserAvatar image={image} speaking={claim.speaking} size={20} />
                ) : null}
                <div style={{ ...claim.reason && { cursor: 'pointer' } }}
                    onClick={() => {
                        if (claim.reason)
                            setToggleReason(!toggleReason)
                    }}>
                    <Typography sx={{
                        ...(isLeft ? { textAlign: 'left' } : { textAlign: 'right' })
                    }} variant="body2"> {claim.claim}


                        {toggleReason && claim.reason &&
                            (
                                <>
                                    <br />
                                    <Typography variant='caption'>
                                        {claim.reason}
                                    </Typography>
                                </>
                            )
                        }

                    </Typography>


                    {claim.loading ? (
                        <Typography variant="caption">Fact checking...
                            <CircularProgress size={10} />
                        </Typography>
                    ) : null}

                </div>


                {!isLeft ? (
                    <UserAvatar image={image} speaking={claim.speaking} size={20} />
                ) : null}

            </Box>


        </Box>

    );

}

function getBgColor(claim) {
    if (claim.loading) return 'grey.300';
    if (claim.score < 0) return 'error.light';
    if (claim.score === 0) return 'warning.main';
    if (claim.score > 0 && claim.score < 1) return 'warning.light';
    return 'success.light';
}
