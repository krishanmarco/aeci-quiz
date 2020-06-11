import React  from "react";
import styled from "styled-components";
import { Alert } from "react-bootstrap";
import { Answer } from "./Answer";
import {
  TAlertVariant,
  TQuestion,
  useResponse,
  useResponsesContext,
} from "./data/Context";

function useModeToQuestionVariant(question: TQuestion): TAlertVariant {
  const {responsesRef} = useResponsesContext()
  const {current} = responsesRef;

  const answerNotSet = current[question.id] == null || current[question.id] === -1
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
    <StyledQuestion>
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
  margin: 24px 0;
  padding: 0 24px;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 6px;
`;
