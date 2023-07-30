import intro from "./../assets/recording/elon/elon_welcome.mp3";
import bidenIntro from "./../assets/recording/biden/biden_intro.mp3";
import intro2 from "./../assets/recording/elon/elon_welcome2.mp3";
import trumpIntro from "./../assets/recording/trump/trump_intro.mp3";
import intro3 from "./../assets/recording/elon/elon_welcome3.mp3";
import bidenUkraine from "./../assets/recording/biden/biden_ukraine.mp3";
// import trumpMailBallots from "./../assets/recording/trump/trump_mail_ballots.mp3";

export const debateScript = [
  {
    role: "moderator",
    name: "Elon Musk",
    text: "Good evening and welcome to the first 2024 presidential debate between President Joe Biden and former President Donald Trump. I’m Elon Musk and I’ll be moderating tonight’s debate. Each candidate will have 2 minutes for an opening statement, beginning with President Biden.",
    category: "opening",
    question: null,
    audioPath: intro,
    nextIndex: 1,
  },
  {
    role: "candidate-2",
    name: "Joe Biden",
    text: "Thank you Elon. My fellow Americans, the past 4 years have presented unprecedented challenges - from the ongoing pandemic to Russia’s unprovoked war against Ukraine. But we have persevered by pulling together as one nation. Our economy is on the rebound, we’ve made historic investments in infrastructure and created millions of good-paying jobs. We’ve rejoined the Paris Climate Accords and are leading the transition to clean energy. We passed common-sense gun laws to help keep our communities safe. Healthcare remains a right for all Americans. We still have more work to do, but we’re on the right track to build a better future for working families. If you give me the honor of re-election, I will continue leading us forward with empathy, compassion and determination.",
    category: "opening",
    question: null,
    audioPath: bidenIntro,
    nextIndex: 2,
  },
  {
    role: "moderator",
    name: "Elon Musk",
    text: "Thank you Mr. President. Mr. Trump, your opening statement?",
    category: "opening",
    question: null,
    audioPath: intro2,
    nextIndex: 3,
  },
  {
    role: "candidate-1",
    name: "Donald Trump",
    text: "Thank you Elon. It’s great to be here. Look, the Biden administration has been a complete and total disaster. Our economy is in shambles with record inflation and high gas prices that are crushing hardworking Americans. Biden surrendered Afghanistan to the Taliban and allowed Russia to invade Ukraine on his watch. Our borders are open and overrun by illegal immigrants. Crime is surging in our cities. Biden is destroying American energy while letting China and India pollute. Healthcare costs are spiraling out of control. Biden is controlled by the radical socialist left that wants to defund the police and shred the Constitution. As your President I’ll stand up to our enemies, grow the economy like never before, lower costs, secure the border and restore law and order. I’ll appoint judges who defend our rights and freedoms. A vote for me means safer communities, less government in your life, and real leadership in the White House. The choice is clear my fellow citizens - together we will Make America Great Again.",
    category: "opening",
    question: null,
    audioPath: trumpIntro,
    nextIndex: 4,
  },
  {
    role: "moderator",
    name: "Elon Musk",
    text: "Thank you Mr. Trump. And that concludes the opening statements. We’ll now move on to the first topic of tonight’s debate, the war in Ukraine. President Biden, you have 2 minutes to respond. What is your stance on the situation in Ukraine and how do you plan to address it?",
    category: "foreign policy",
    question:
      "What is your stance on the situation in Ukraine and how do you plan to address it?",
    audioPath: intro3,
    nextIndex: 5,
  },
  {
    role: "candidate-2",
    name: "Joe Biden",
    text: "Thank you Elon. Look, let me be clear, Putin’s invasion of Ukraine is an unprovoked act of aggression that threatens democracy in Europe and beyond. My administration has led the effort to support the brave Ukrainian people with military aid, humanitarian relief and crippling sanctions on Russia. But there are still tough days ahead. We’ll continue rallying our NATO allies to stand united against Russian aggression. And I’ll keep supplying Ukraine’s fighters with the weapons they need to defend their homeland, even as Putin continues his brutal assaults on civilians. We’ll welcome Ukrainian refugees with open arms. Most importantly, we’ll keep standing on the side of freedom and sovereignty. Putin wants to destroy the international order. On my watch, that simply won’t happen. The free world will meet this test - democracy will prevail over tyranny.",
    category: "foreign policy",
    audioPath: bidenUkraine,
    question:
      "What is your stance on the situation in Ukraine and how do you plan to address it?",
  },
];
