import { useLayoutEffect } from "react";
import { useOutletContext } from "react-router-dom";

export const useHeader = (config: HeaderConfig) => {
  const { setHeader, resetHeader } = useOutletContext<HeaderCtx>();

  useLayoutEffect(() => {
    setHeader(config);
  }, [setHeader, config]);

  useLayoutEffect(() => {
    return () => {
      resetHeader();
    };
  }, [resetHeader]);
};
