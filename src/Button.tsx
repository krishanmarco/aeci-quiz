import * as React from 'react';
import styled from 'styled-components';
import { Loader } from "./Loader";

type TButtonProps = {
  text: string;
  onClick: () => void;
  loading?: boolean;
};

export const Button = ({
                         text,
                         onClick,
                         loading = false,
                       }: TButtonProps) => {
  return (
    <StyledMenuButton
      disabled={loading}
      onClick={onClick}>
      {loading ? (
        <Loader
          size={5}
          loading={loading}/>
      ) : (
        text.toUpperCase()
      )}
    </StyledMenuButton>
  );
}

const StyledMenuButton = styled.button`
  font-size: .9em;
  height: 24px;
  width: 96px;
  margin: 0 6px;
`
