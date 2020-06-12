import * as React from 'react';
import styled from 'styled-components';

type TMenuFooterProps = {
  //
};

export const MenuFooter = ({}: TMenuFooterProps) => {
  return (
    <StyledMenu>
      <FooterContainer>
        <a href='https://www.krishanmarcomadan.com'>Krishan Marco Madan</a>
      </FooterContainer>
    </StyledMenu>
  );
}

const StyledMenu = styled.div`
  padding: 12px;
`

const FooterContainer = styled.div`
  text-align: right;
`
