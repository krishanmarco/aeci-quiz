import { MutableRefObject } from "react";

export type TAnswerId = number;
export type TAnswer = {
  id: TAnswerId;
  text: string;
  isCorrect: boolean;
};

export type TQuestionId = number;
export type TQuestion = {
  id: TQuestionId;
  text: string;
  answerId: TAnswerId;
  answers: TAnswer[];
};


export type TResponses = {
  [questionId: number]: TAnswerId;
};

export type TSetResponse = (questionId: TQuestionId, answerId: TAnswerId) => void;

export type TAlertVariant = 'primary' | 'secondary' | 'success' | 'danger';

export type TResponsesContext = {
  responsesRef: MutableRefObject<TResponses>;
  setRefResponse: TSetResponse
};
