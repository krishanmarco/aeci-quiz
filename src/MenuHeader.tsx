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
  }, [clearPersistResponses]);

  return [onClick, loading]
}

export const MenuHeader = ({}: TMenuHeaderProps) => {
  const [onResetClick, resetLoading] = useResetButton();
  return (
    <StyledMenu>
      <HeaderContainer>
        <h6>Quiz VDS/VL - Aero Club d'Italia</h6>
      </HeaderContainer>
      <StyledResetButton
        disabled={resetLoading}
        onClick={onResetClick}>
        {resetLoading ? (
          <Loader
            size={5}
            loading={resetLoading}/>
        ) : (
          'Reset'.toUpperCase()
        )}
      </StyledResetButton>
    </StyledMenu>
  );
}

const StyledMenu = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 12px;
  background-color: #dddddd;
  z-index: 999;
`

const HeaderContainer = styled.div`
  text-align: center;
`

const StyledResetButton = styled.button`
  font-size: .9em;
  height: 24px;
  width: 72px;
`
