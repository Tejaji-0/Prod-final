export interface Player {
  id: number;
  name: string;
  score: number;
  key: string;
  hasAnswered: boolean;
}

export interface Question {
  id: string;
  topic: string;
  value: number;
  text: string;
  answer: string;
  type: 'regular' | 'cat' | 'auction';
}

export interface Topic {
  name: string;
  questions: Question[];
}

export interface Round {
  number: 1 | 2;
  topics: Topic[];
}

export interface GameState {
  phase: 'setup' | 'round1' | 'round1-transition' | 'round2' | 'round2-transition' | 'final' | 'results';
  players: Player[];
  currentRound: Round | null;
  playedQuestions: Set<string>;
  currentQuestion: Question | null;
  currentPlayerIndex: number;
  answeringPlayerIndex: number | null;
  timeLeft: number;
  devMode: boolean;
  finalBets: Map<number, number>;
  finalAnswers: Map<number, string>;
  auctionBets: Map<number, number>;
  auctionCurrentBidder: number | null;
  catInBagRecipient: number | null;
  catInBagBet: number | null;
}

export interface QuestionPackage {
  round1: Topic[];
  round2: Topic[];
  catInBagTopics: string[];
  catInBagQuestions: Question[];
  finalQuestion: Question;
}
