import type { Question } from "./quiz";

export interface ReadingQuizProps {
  currentQuestion: Question | null;
  currentPassage: { passage: string | null } | null;
  currentIndex: number;
  userAnswer: string;
  score: number;
  weightedScoreValue: number;
  estimatedLevel: string;
  finished: boolean;
  timer: number;
  averageTime: number;
  timeout: boolean;
  TIME_LIMIT: number;
  totalQuestions: number;
}