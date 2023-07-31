import kickoff from "./../assets/audio/kickoff.mp3";
import bidenIntro from "./../assets/audio/biden_opening.mp3";
import trumpIntro from "./../assets/audio/trump_opening.mp3";
import trumpRebuttal from "./../assets/audio/trump_rebuttal.mp3";
import bidenRebuttal from "./../assets/audio/biden_rebuttal.mp3";

export const updatedScript = [];

export const debateScript = [
  {
    role: "moderator",
    name: "Elon Musk",
    text: "Ladies and Gentlemen, welcome to this exciting presidential debate. Let’s dive right in. First question on the economy: How would you work to ensure continued growth and sustainability of the American economy?",
    category: "opening",
    question: null,
    audioPath: kickoff,
    nextIndex: 1,
  },
  {
    role: "candidate-1",
    name: "Donald Trump",
    text: "Under my administration, we had record stock market numbers. Unemployment was the lowest in history. This is fact. But now, the economy’s a mess. Biden has put the brakes on growth with his radical policies. We need to cut taxes again, bring back manufacturing, and end the war on coal. That’s how we make America great again",
    category: "opening",
    question: null,
    audioPath: trumpIntro,
    nextIndex: 2,
  },

  {
    role: "candidate-2",
    name: "Joe Biden",
    text: "Well, here’s the thing, folks. Under my administration, we created millions of jobs in renewable energy, and we raised the minimum wage. But, um, there’s more to do. We need to build an economy that doesn’t just reward wealth, but the work people do. And we’ve got to ensure the rich pay their fair share of taxes. It’s about getting America back on track.",
    category: "foreign policy",
    audioPath: bidenIntro,
    question:
      "Well, here’s the thing, folks. Under my administration, we created millions of jobs in renewable energy, and we raised the minimum wage. But, um, there’s more to do. We need to build an economy that doesn’t just reward wealth, but the work people do. And we’ve got to ensure the rich pay their fair share of taxes. It’s about getting America back on track.",
  },
  {
    role: "candidate-1",
    name: "Donald Trump",
    text: "Biden’s green jobs are a pipe dream. Under his watch, gas prices skyrocketed. Your energy bills, your grocery bills, everything is more expensive. And he wants to tax the rich? They’re the job creators. Biden is a job killer, plain and simple.",
    category: "opening",
    question: null,
    audioPath: trumpRebuttal,
    nextIndex: 4,
  },

  {
    role: "candidate-2",
    name: "Joe Biden",
    text: "Folks, under Trump, the wealth gap widened. It’s true, the rich got richer, but the middle class, they’ve been left behind. We need an economy that works for everyone, not just the 1%. That’s what I’m working towards, for all of us",
    category: "foreign policy",
    audioPath: bidenRebuttal,
  },
];
