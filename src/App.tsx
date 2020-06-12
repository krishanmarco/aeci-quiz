import * as React from 'react';
import styled from "styled-components";
import { Question, } from './Question';
import { QUESTIONS_MAP, ResponsesContextProvider } from "./lib/ResponsesContext";
import { DbContextProvider } from "./lib/DbContext";
import { MenuFooter } from "./MenuFooter";
import { MenuHeader } from "./MenuHeader";

export const App = () => {
  return (
    <ResponsesContextProvider>
      <DbContextProvider>
        <StyledApp>
          <MenuHeader/>
          {QUESTIONS_MAP.map((question) => (
            <Question
              key={question.id}
              question={question}/>
          ))}
          <hr/>
          <MenuFooter/>
        </StyledApp>
      </DbContextProvider>
    </ResponsesContextProvider>
  );
}

const StyledApp = styled.div`
  font-size: 14px;
`;
