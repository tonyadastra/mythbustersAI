import React from 'react';
import sampleClaims from '../data/claims';


export const DebateContext = React.createContext({});

export const DebateContextProvider = ({ children }) => {
    const [transcripts, setTranscripts] = React.useState([]);
    const [claims, setClaims] = React.useState([]);
    const [inSession, setInSession] = React.useState(false);

    return (
        <DebateContext.Provider value={{
            transcripts, setTranscripts, claims, setClaims,
            inSession, setInSession
        }}>
            {children}
        </DebateContext.Provider>
    )
};

export default DebateContext;