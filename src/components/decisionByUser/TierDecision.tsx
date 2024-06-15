import { DecisionButton } from "@components/atoms/Buttons";
import s from "./DecisionComponents.module.scss";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userInfo from "@utils/userInfo";
import { DecisionViewer } from "@components/decisionByUser/DecisionViewer";
import { useRealtimeDB } from "@utils/useRealtimeDB";

export const TierDecision = () => {
  const { name, userId } = useRecoilValue(userInfo);
  const [decisionData, push] = useRealtimeDB(`/userDecision/${userId}`);
  const [tierSelect] = useRealtimeDB(`/tierDecisionUser`, false);
  const [isTierDecision, setIsTierDecision] = useState<boolean>(false);

  useEffect(() => {
    if (tierSelect) {
      const { username: curUser } = tierSelect;
      if (curUser === name) setIsTierDecision(true);
      else setIsTierDecision(false);
    }
  }, [tierSelect, name]);

  const decisionHandler = async ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    push({ name, decision: id, createdAt: Date.now() });
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>{name}'s decision</h1>
      <DecisionViewer decision={decisionData?.decision ?? ""} />
      <div className={`${s.btns} ${s.col}`}>
        {isTierDecision ? (
          <>
            <DecisionButton onClick={decisionHandler} id="S" className={s.S}>
              S
            </DecisionButton>
            <DecisionButton onClick={decisionHandler} id="A" className={s.A}>
              A
            </DecisionButton>
            <DecisionButton onClick={decisionHandler} id="B" className={s.B}>
              B
            </DecisionButton>
            <DecisionButton onClick={decisionHandler} id="C" className={s.C}>
              C
            </DecisionButton>
            <DecisionButton onClick={decisionHandler} id="D" className={s.D}>
              D
            </DecisionButton>
          </>
        ) : (
          <>
            <DecisionButton onClick={decisionHandler} id="up" className={s.up}>
              👍
            </DecisionButton>
            <DecisionButton onClick={decisionHandler} id="ok" className={s.ok}>
              👌
            </DecisionButton>
            <DecisionButton
              onClick={decisionHandler}
              id="down"
              className={s.down}
            >
              👎
            </DecisionButton>
          </>
        )}
      </div>
    </div>
  );
};
