import { useEffect } from "react";

export const usePreventLeave = (callback: () => void) => {
  const listener = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
    callback();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", listener);

    () => window.removeEventListener("beforeunload", listener);
  }, []);
};
