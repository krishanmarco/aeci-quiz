import React from "react";
import * as _ from "lodash";
import { TQuestion, TAnswerId, TResponses, TResponsesContext, TQuestionId } from "../data/Types";

const questionsObj = require('../data/paragliding.json');
export const QUESTIONS_MAP = _.values(questionsObj) as TQuestion[];
export const defaultResponseId = -1;

export const responsesContextInitial: TResponsesContext = {
  responsesRef: {current: {}},
  setRefResponse: _.noop,
};

const ResponsesContext = React.createContext(responsesContextInitial);

export function useResponsesContext() {
  return React.useContext(ResponsesContext);
}

export const ResponsesContextProvider = ({children}: { children: React.ReactElement }) => {
  const responsesRef = React.useRef<TResponses>({})

  const setRefResponse = React.useCallback((questionId: TQuestionId, response: TAnswerId) => {
    responsesRef.current[questionId] = response;
  }, []);
  const value: TResponsesContext = {
    responsesRef,
    setRefResponse,
  };
  return (
    <ResponsesContext.Provider value={value}>
      {children}
    </ResponsesContext.Provider>
  );
}
