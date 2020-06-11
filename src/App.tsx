import * as React from 'react';
import styled from "styled-components";
import { Question, } from './Question';
import { QUESTIONS_MAP, ResponsesContextProvider } from "./data/Context";

export const App = () => {
  return (
    <ResponsesContextProvider>
      <StyledApp>
        {QUESTIONS_MAP.map((question) => (
          <Question
            key={question.id}
            question={question}/>
        ))}
      </StyledApp>
    </ResponsesContextProvider>
  );
}

const StyledApp = styled.div`
  margin: 24px 0;
  padding: 0 24px;
`;
