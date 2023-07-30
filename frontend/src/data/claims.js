// score: -1: lie, 0: unsure, 0.5: half-truth, 1: truth

const claims = [
  {
    id: "candidate-1",
    claim: "I am the best president ever",
    speaker: "Donald Trump",
    speaker_id: "trump",
    unsure_flag: true,
    score: .5,
    reason: "He is not the best president ever",
  },
  {
    id: "candidate-2",
    claim: "I am the best president ever",
    speaker: "Joe Biden",
    speaker_id: "biden",
    
    time: 0,
    score: 0.5,
    reason: "He is the worst president ever",
  },
  {
    id: "candidate-2",
    claim: "I am the best president ever asdhfa oisdgio;asd fgho",
    speaker: "Joe Biden",
    speaker_id: "biden",
    loading: true,
  },
  {
    id: "candidate-1",
    claim: "I know more about the military than anyone else",
    speaker: "Donald Trump",
    speaker_id: "trump",
    time: 0,
    score: -.7,
  },
  {
    id: "candidate-1",
    claim: "I know more about the military than anyone else",
    speaker: "Donald Trump",
    speaker_id: "trump",
    time: 0,
    score: -.7,
  },
  {
    id: "candidate-1",
    claim: "I know more about the military than anyone else",
    speaker: "Donald Trump",
    speaker_id: "trump",
    time: 0,
    score: -.7,
  },
  {
    id: "candidate-1",
    claim: "I know more about the military than anyone else",
    speaker: "Donald Trump",
    speaker_id: "trump",
    time: 0,
    score: -.7,
  },
  {
    id: "candidate-1",
    claim: "I know more about the military than anyone else",
    speaker: "Donald Trump",
    speaker_id: "trump",
    time: 0,
    score: -.7,
  },


  {
    id: "candidate-1",
    claim: "I know more about the military than anyone else",
    speaker: "Donald Trump",
    speaker_id: "trump",
    time: 0,
    score: -.7,
  },
  {
    id: "candidate-1",
    claim: "I know more about the military than anyone else",
    speaker: "Donald Trump",
    speaker_id: "trump",
    time: 0,
    reason: "He does not know more about the military than anyone else",
    score: -.7,
  },
  {
    id: "candidate-2",
    claim: "I am the best president ever",
    speaker: "Joe Biden",
    speaker_id: "biden",
    time: 0,
    score: 0.5,
    reason: "He is the worst president ever",
  },

];

export default claims;
