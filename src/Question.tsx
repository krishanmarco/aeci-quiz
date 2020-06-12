import React from "react";
import styled from "styled-components";
import { Alert } from "react-bootstrap";
import { Answer } from "./Answer";
import {
  defaultResponseId,
  useResponsesContext,
} from "./lib/ResponsesContext";
import { TAlertVariant, TAnswerId, TQuestion } from "./data/Types";
import { useDbContext } from "./lib/DbContext";
import { MENU_HEADER_HEIGHT } from "./MenuHeader";

export function useResponse({id}: TQuestion) {
  const {responsesRef, setRefResponse} = useResponsesContext();
  const {getPersistResponse, setPersistResponse} = useDbContext();

  const [response, setStateResponse] = React.useState<TAnswerId>(responsesRef.current[id]);

  const _setResponse = React.useCallback((newResponse: TAnswerId) => {
    setRefResponse(id, newResponse);
    setStateResponse(newResponse);
  }, [setRefResponse, setStateResponse]);

  // Only the first time
  React.useEffect(() => {
    getPersistResponse(id)
      .then(responsesDbData => _setResponse(responsesDbData))
      .catch()
  }, []);

  const setResponse = React.useCallback((newResponse: TAnswerId) => {
    _setResponse(newResponse);
    setPersistResponse(id, newResponse);
  }, [setPersistResponse, _setResponse]);

  const toggleResponse = React.useCallback((newResponse: TAnswerId) => {
    const newVal = response !== newResponse
      ? newResponse
      : defaultResponseId;
    setResponse(newVal)
  }, [response, setResponse]);

  return {
    response,
    setResponse,
    toggleResponse,
  };
}

function useModeToQuestionVariant(question: TQuestion): TAlertVariant {
  const {responsesRef} = useResponsesContext()
  const {current} = responsesRef;

  const answerNotSet = current[question.id] == null || current[question.id] === defaultResponseId
  if (answerNotSet) {
    return 'primary';
  }

  return question.answerId == current[question.id]
    ? 'success'
    : 'danger';
}

type TQuestionBaseProps = {
  question: TQuestion,
};

export const Question = React.memo(({
                                      question,
                                    }: TQuestionBaseProps) => {
  const {response, toggleResponse} = useResponse(question)
  const questionVariant = useModeToQuestionVariant(question)
  return (
    <StyledQuestion id={`q-${question.id}`}>
      <StyledAlert variant={questionVariant}>
        {question.text}
      </StyledAlert>
      {question.answers.map((answer) => (
        <Answer
          key={`${question.id}-${answer.id}`}
          answer={answer}
          checked={answer.id === response}
          onClick={toggleResponse}/>
      ))}
    </StyledQuestion>
  )
});

const StyledQuestion = styled.div`
  padding: 0 0 24px 0;
  scroll-margin-top: ${MENU_HEADER_HEIGHT}px;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 6px;
`;
