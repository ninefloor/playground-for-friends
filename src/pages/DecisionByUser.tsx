import { useLocation } from "react-router-dom";
import s from "./DecisionByUser.module.scss";
import { VoteDecision } from "@components/decisionByUser/VoteDecision";

export const DecisionByUser = () => {
  const location = useLocation();

  switch (location.pathname) {
    case "/vote":
      return (
        <div className={s.container}>
          <VoteDecision />
        </div>
      );

    default:
      return <div className={s.container}>잘못된 접근입니다.</div>;
  }
};
