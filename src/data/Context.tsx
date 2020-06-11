import React, { MutableRefObject } from "react";
import * as _ from "lodash";

export type TQuestion = {
  id: number;
  text: string;
  answerId: TResponse;
  answers: TAnswer[];
};

export type TAnswer = {
  id: number;
  text: string;
  isCorrect: boolean;
};

export type TResponse = number;
export type TResponses = {
  [questionId: number]: TResponse;
};

export type TSetResponses = (responses: TResponses) => void;
export type TSetResponse = (questionId: number, response: TResponse) => void;

export type TAlertVariant = 'primary' | 'secondary' | 'success' | 'danger';

export type TResponsesContext = {
  responsesRef: MutableRefObject<TResponses>;
  setRefResponse: TSetResponse
  setRefResponses: TSetResponses
};

const questionsObj = require('./paragliding.json');
export const QUESTIONS_MAP = _.values(questionsObj) as TQuestion[];

export const responsesContextInitial: TResponsesContext = {
  responsesRef: {current: {}},
  setRefResponse: _.noop,
  setRefResponses: _.noop,
};

const ResponsesContext = React.createContext(responsesContextInitial);

export function useResponsesContext() {
  return React.useContext(ResponsesContext);
}

export const ResponsesContextProvider = ({children}: { children: React.ReactElement }) => {
  const responsesRef = React.useRef<TResponses>(responsesContextInitial.responsesRef.current)
  const setRefResponses = React.useCallback((responses: TResponses) => {
    responsesRef.current = responses;
  }, []);
  const setRefResponse = React.useCallback((questionId: number, response: TResponse) => {
    responsesRef.current[questionId] = response;
  }, []);
  const value: TResponsesContext = {
    responsesRef,
    setRefResponse,
    setRefResponses
  };
  return (
    <ResponsesContext.Provider value={value}>
      {children}
    </ResponsesContext.Provider>
  );
}

export function useResponse({id}: TQuestion) {
  const {responsesRef, setRefResponse} = useResponsesContext();
  const [response, _setResponse] = React.useState<TResponse>(responsesRef.current[id]);

  const setResponse = React.useCallback((newResponse: TResponse) => {
    setRefResponse(id, newResponse);
    _setResponse(newResponse);
  }, [id, _setResponse, setRefResponse]);

  const toggleResponse = React.useCallback((newResponse: TResponse) => {
    const newVal = response !== newResponse
      ? newResponse
      : -1;
    setResponse(newVal)
  }, [response, setResponse]);

  return {
    response,
    setResponse,
    toggleResponse,
  };
}
