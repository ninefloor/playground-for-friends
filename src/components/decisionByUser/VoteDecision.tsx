import { DecisionButton } from "@components/atoms/Buttons";
import { DecisionViewer } from "@components/decisionByUser/DecisionViewer";
import { useRealtimeDB } from "@utils/useRealtimeDB";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useAtomValue } from "jotai";
import { type MouseEvent } from "react";
import s from "./DecisionComponents.module.scss";

export const VoteDecision = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const { data, push } = useRealtimeDB(`/userDecision/${userInfo?.uid}`);

  const decisionHandler = async ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    push({ name: userInfo?.nickname, decision: id, createdAt: Date.now() });
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>{userInfo?.nickname}'s decision</h1>
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
