import { useRealtimeDB } from "@utils/useRealtimeDB";
import s from "./DecisionByAdmin.module.scss";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { VoteBoard } from "@components/decisionByAdmin/VoteBoard";

export const DecisionByAdmin = () => {
  const { push } = useRealtimeDB("/activeAdmin", false);
  const location = useLocation();
  const type = location.pathname.slice(7);

  useEffect(() => {
    push({
      join: true,
      type,
      createAt: Date.now(),
    });
  }, []);

  switch (location.pathname) {
    case "/admin/vote":
      return <VoteBoard />;

    case "/admin/tier":
      return <div className={s.container}></div>;
  }
};
