import { DecisionButton } from "@components/atoms/Buttons";
import s from "./VoteDecision.module.scss";
import { MouseEvent } from "react";
import { useRecoilValue } from "recoil";
import userInfo from "@utils/userInfo";
import { DecisionViewer } from "@components/decisionByUser/DecisionViewer";
import { useRealtimeDB } from "@utils/useRealtimeDB";

export const VoteDecision = () => {
  const { name, userId } = useRecoilValue(userInfo);
  const [data, push] = useRealtimeDB(`/userDecision/${userId}`);

  const decisionHandler = async ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    push({ name, decision: id, createdAt: Date.now() });
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>{name}'s decision</h1>
      <DecisionViewer decision={data?.decision ?? ""} />
      <div className={s.btns}>
        <DecisionButton onClick={decisionHandler} id="L" className={s.L}>
          L
        </DecisionButton>
        <DecisionButton onClick={decisionHandler} id="R" className={s.R}>
          R
        </DecisionButton>
      </div>
    </div>
  );
};
