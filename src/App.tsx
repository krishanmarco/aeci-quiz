import * as React from 'react';
import styled from "styled-components";
import { Question, } from './Question';
import { QUESTIONS_MAP, ResponsesContextProvider } from "./lib/ResponsesContext";
import { DbContextProvider } from "./lib/DbContext";

export const App = () => {
  return (
    <ResponsesContextProvider>
      <DbContextProvider>
        <StyledApp>
          {QUESTIONS_MAP.map((question) => (
            <Question
              key={question.id}
              question={question}/>
          ))}
        </StyledApp>
      </DbContextProvider>
    </ResponsesContextProvider>
  );
}

const StyledApp = styled.div`
  margin: 24px 0;
  padding: 0 24px;
`;
