import { Button, CircleButton } from "@components/atoms/Buttons";
import { RouletteForDraw } from "@components/decisionByAdmin/vote/RouletteForDraw";
import { WaitingUserCard } from "@components/decisionByAdmin/vote/UserItem";
import { useRTDBList } from "@utils/useRTDBList";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import s from "./VoteBoard.module.scss";

export const VoteBoard = () => {
  const { roomId } = useParams();
  const [resultValue, setResultValue] = useState({ L: 0, R: 0 });
  const [result, setResult] = useState("");
  const [isFRVisible, setIsFRVisible] = useState(false);
  const [isShowRoulette, setIsShowRoulette] = useState(false);
  const navigate = useNavigate();
  const { array: participants } = useRTDBList<RoomParticipant>(
    roomId ? `/roomsParticipants/${roomId}` : null
  );
  const { updateMulti } = useRTDBWrite();

  useEffect(() => {
    // 참가자 decision 필드 기반으로 그래프 집계
    const L = participants.filter((u) => u.decision === "L").length;
    const R = participants.filter((u) => u.decision === "R").length;
    setResultValue({ L, R });
  }, [participants]);

  const refreshHandler = async () => {
    if (!roomId) return;
    try {
      const updates: Record<string, string> = {};
      (participants ?? []).forEach((u) => {
        updates[`/roomsParticipants/${roomId}/${u.uid}/decision`] = "";
      });
      if (Object.keys(updates).length > 0) {
        await updateMulti(updates);
      }
    } catch (e) {
      console.error(e);
      alert("투표 초기화 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={s.container}>
      <Button
        className={s.backBtn}
        variant="black"
        onClick={() => navigate(-1)}
        inline
      >
        BACK
      </Button>
      {isShowRoulette && isFRVisible && (
        <RouletteForDraw setResultValue={setResultValue} />
      )}

      <div className={s.resultCount}>
        <div className={s.left}>{resultValue.L}</div>
        <div className={s.right}>{resultValue.R}</div>
      </div>

      <div className={s.users}>
        <div className={`${s.decisionUsers} ${s.left}`}></div>
        <div className={`${s.decisionUsers} ${s.draw}`}></div>
        <div className={`${s.decisionUsers} ${s.right}`}></div>
      </div>

      <div className={s.graph}>
        {(() => {
          const total = resultValue.L + resultValue.R;
          const lw = total ? (resultValue.L / total) * 100 : 0;
          const rw = total ? (resultValue.R / total) * 100 : 0;
          return (
            <>
              <div className={s.L} style={{ width: lw + "%" }} />
              <div className={s.R} style={{ width: rw + "%" }} />
            </>
          );
        })()}
      </div>
      {/* 참가자 개별 카드(관리자용) */}
      <div className={s.users}>
        {roomId &&
          participants
            .filter((user) => ["", "GIVE_UP"].includes(user.decision))
            .map((user) => (
              <WaitingUserCard
                key={user.uid}
                roomId={roomId}
                uid={user.uid}
                user={user}
              />
            ))}
      </div>
      <CircleButton className={s.refreshBtn} onClick={refreshHandler}>
        refresh
      </CircleButton>

      {result && (
        <CircleButton
          className={s.visibleBtn}
          onClick={() => {
            setIsFRVisible((prev) => !prev);
          }}
        >
          visivle
        </CircleButton>
      )}
    </div>
  );
};
