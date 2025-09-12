import { useNavigate, useParams } from "react-router-dom";
import s from "./VoteBoard.module.scss";
import { useEffect, useState } from "react";
import { RouletteForDraw } from "@components/decisionByAdmin/vote/RouletteForDraw";
import { Button, CircleButton } from "@components/atoms/Buttons";
import { useGetUserData } from "@utils/useGetUserData";
import { useRTDBList } from "@utils/useRTDBList";
import { useRTDBWrite } from "@utils/useRTDBWrite";

export const VoteBoard = () => {
  const { roomId } = useParams();
  const { users, loading } = useGetUserData();
  const [picks, setPicks] = useState({});
  const [resultValue, setResultValue] = useState({ L: 0, R: 0 });
  const [result, setResult] = useState("");
  const [isFRVisible, setIsFRVisible] = useState(false);
  const [isShowRoulette, setIsShowRoulette] = useState(false);
  const navigate = useNavigate();
  const { items: participants } = useRTDBList<RoomParticipant>(
    roomId ? `/roomsParticipants/${roomId}` : ""
  );
  const { updateMulti } = useRTDBWrite();

  useEffect(() => {
    // 참가자 decision 필드 기반으로 그래프 집계
    const values = Object.values(participants ?? {}) as RoomParticipant[];
    const L = values.filter((u) => u.decision === "L").length;
    const R = values.filter((u) => u.decision === "R").length;
    setResultValue({ L, R });
  }, [participants]);

  return (
    <div className={s.container}>
      <Button className={s.backBtn} variant="black" onClick={() => navigate(-1)} inline>
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
        <div
          className={s.L}
          style={{
            width:
              (resultValue.L / (resultValue.L + resultValue.R)) * 100 + "%",
          }}
        />
        <div
          className={s.R}
          style={{
            width:
              (resultValue.R / (resultValue.L + resultValue.R)) * 100 + "%",
          }}
        />
      </div>
      <CircleButton
        className={s.refreshBtn}
        onClick={async () => {
          if (!roomId) return;
          try {
            const updates: Record<string, any> = {};
            Object.keys(participants ?? {}).forEach((uid) => {
              updates[`/roomsParticipants/${roomId}/${uid}/decision`] = "";
            });
            if (Object.keys(updates).length > 0) {
              await updateMulti(updates);
            }
          } catch (e) {
            alert("투표 초기화 중 오류가 발생했습니다.");
          }
        }}
      >
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
