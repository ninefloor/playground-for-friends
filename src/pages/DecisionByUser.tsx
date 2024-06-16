import { useLocation, useNavigate } from "react-router-dom";
import s from "./DecisionByUser.module.scss";
import { VoteDecision } from "@components/decisionByUser/VoteDecision";
import { TierDecision } from "@components/decisionByUser/TierDecision";
import { useRealtimeDB } from "@utils/useRealtimeDB";
import { Button } from "@components/atoms/Buttons";

export const DecisionByUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data] = useRealtimeDB("/activeAdmin", false);

  switch (location.pathname) {
    case "/vote":
      return (
        <div className={s.container}>
          {!data?.join && (
            <div className={s.notLaunch}>
              <h2>not launch yet</h2>
              <Button onClick={() => navigate("/")}>back</Button>
            </div>
          )}
          <VoteDecision />
        </div>
      );

    case "/tier":
      return (
        <div className={s.container}>
          {!data?.join && (
            <div className={s.notLaunch}>
              <h2>not launch yet</h2>
              <Button onClick={() => navigate("/")}>back</Button>
            </div>
          )}
          <TierDecision />
        </div>
      );
  }
};
