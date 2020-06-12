import * as React from 'react';
import { BeatLoader } from "react-spinners";

type TLoaderProps = {
  size: number;
  loading: boolean;
};

export const Loader = ({size, loading}: TLoaderProps) => {
  return (
    <BeatLoader
      size={size}
      color={"#000"}
      loading={loading}/>
  );
};
