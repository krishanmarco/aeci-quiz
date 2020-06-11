import React from "react";
import styled from "styled-components";
import * as _ from "lodash";
import { Form } from "react-bootstrap";
import { TAnswer, TAnswerId } from "./data/Types";

type TAnswerProps = {
  answer: TAnswer;
  checked: boolean;
  onClick: (id: TAnswerId) => void;
};

export const Answer = ({
                         answer,
                         checked,
                         onClick: _onClick,
                       }: TAnswerProps) => {
  const onClick = React.useCallback(() => {
    return _onClick(answer.id);
  }, [_onClick, answer.id])
  return (
    <StyledAnswer onClick={onClick}>
      <Form.Check
        type='radio'
        label={answer.text}
        checked={checked}
        onChange={_.noop}/>
    </StyledAnswer>
  )
}

const StyledAnswer = styled.div`
  padding: 0 24px;
`;
