export interface Question {
  text: string;
  choices: string[];
  answer: string;
  audio?: string;
}

export interface QuestionSet {
  passage: string;
  questions: Question[];
}

// export interface ReadingSet {
//   standalone: Question[];
//   passages: QuestionSet[];
//   long_passages: QuestionSet[];
// }
