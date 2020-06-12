import * as React from 'react';
import styled from 'styled-components';
import { useDbContext } from "./lib/DbContext";
import { Loader } from "./Loader";

type TMenuHeaderProps = {
  //
};

function useResetButton(): [() => void, boolean] {
  const {clearPersistResponses} = useDbContext();
  const [loading, setLoading] = React.useState(false);

  const onClick = React.useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        await clearPersistResponses();
        window.location.reload();
      } catch (e) {
        console.log("Menu:useResetButton, failed to clear persisted responses");
      } finally {
        setLoading(false);
      }
    })();
  }, [clearPersistResponses, setLoading]);

  return [onClick, loading]
}

function useContinueButton(): [() => void, boolean] {
  const {getLastSetQuestionId} = useDbContext();
  const [loading, setLoading] = React.useState(false);

  const onClick = React.useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        const lastSetQuestionId = parseInt(await getLastSetQuestionId() || '-1', 10);
        const element = document.getElementById(`q-${lastSetQuestionId + 1}`);
        element && element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } catch (e) {
        console.log("Menu:useResetButton, failed to scroll to last set question");
      } finally {
        setLoading(false);
      }
    })();
  }, [getLastSetQuestionId]);

  return [onClick, loading]
}

export const MenuHeader = (props: TMenuHeaderProps) => {
  const [onResetClick, resetLoading] = useResetButton();
  const [onContinueClick, continueLoading] = useContinueButton();
  return (
    <StyledMenu>
      <HeaderContainer>
        <h6>Quiz VDS/VL - Aero Club d'Italia</h6>
      </HeaderContainer>
      <StyledMenuButton
        disabled={resetLoading}
        onClick={onResetClick}>
        {resetLoading ? (
          <Loader
            size={5}
            loading={resetLoading}/>
        ) : (
          'Azzera'.toUpperCase()
        )}
      </StyledMenuButton>
      <StyledMenuButton
        disabled={continueLoading}
        onClick={onContinueClick}>
        {resetLoading ? (
          <Loader
            size={5}
            loading={continueLoading}/>
        ) : (
          'Riprendi'.toUpperCase()
        )}
      </StyledMenuButton>
    </StyledMenu>
  );
}

export const MENU_HEADER_HEIGHT = 84;
const StyledMenu = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: ${MENU_HEADER_HEIGHT}px;
  padding: 12px;
  background-color: #dddddd;
  z-index: 999;
`

const HeaderContainer = styled.div`
  text-align: center;
`

const StyledMenuButton = styled.button`
  font-size: .9em;
  height: 24px;
  width: 96px;
  margin: 0 6px;
`
