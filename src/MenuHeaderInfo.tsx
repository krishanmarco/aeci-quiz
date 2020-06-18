import * as React from 'react';
import styled from 'styled-components';
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { TMenuHeaderProps } from "./MenuHeader";
import { useResponsesContext } from "./lib/ResponsesContext";

function calcPercent(total: number, value: number) {
  return Math.round(100 / total * value);
}

export const MenuHeaderInfo = ({
  questions,
                               }: TMenuHeaderProps) => {
  const {responsesRef, setRefResponse} = useResponsesContext();

  const [scrollY, setScrollY] = React.useState(0);

  useScrollPosition(({currPos}) => setScrollY(currPos.y))

  const totalQuestionsCount = questions.length;
  const doneQuestionsCount = 0;
  const doneQuestionsPerc = calcPercent(totalQuestionsCount, doneQuestionsCount)

  const correctQuestionsCount = 0
  const correctQuestionsPerc = calcPercent(doneQuestionsCount, correctQuestionsCount)

  const totalQuestionsHeight = window.innerHeight;
  const scrollPositionPerc = calcPercent(totalQuestionsHeight, scrollY)
  return (
    <TextInfoContainer>
      <TextInfo>{doneQuestionsPerc}% - {doneQuestionsCount} / {totalQuestionsCount}</TextInfo>
      <TextInfo>{correctQuestionsPerc}% - {doneQuestionsCount} / {correctQuestionsCount}</TextInfo>
      <TextInfo>{scrollPositionPerc}% - {totalQuestionsHeight} / {scrollY}</TextInfo>
    </TextInfoContainer>
  )
}

const TextInfoContainer = styled.div`
  margin: 0 6px;
`

const TextInfo = styled.span`
  display: flex;
  font-size: .7em;
`
