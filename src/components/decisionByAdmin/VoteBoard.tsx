import { Button, CircleButton } from "@components/atoms/Buttons";
import { RouletteForDraw } from "@components/decisionByAdmin/vote/RouletteForDraw";
import {
  DecisionUserCard,
  WaitingUserCard,
} from "@components/decisionByAdmin/vote/UserItem";
import { useRTDBList } from "@utils/useRTDBList";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import { forceCenter, forceCollide, forceSimulation } from "d3-force";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import s from "./VoteBoard.module.scss";

const DecisionUserBoard = ({
  participants,
  className,
  roomId,
}: {
  participants: RoomParticipant[];
  className?: string;
  roomId: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<
    (RoomParticipant & { x?: number; y?: number })[]
  >([]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    const simNodes = participants.map((participants) => ({
      ...participants,
      x: Math.random(),
      y: Math.random(),
    }));
    const sim = forceSimulation(simNodes)
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide(4))
      .alpha(1)
      .alphaDecay(0.03)
      .on("tick", () => setNodes([...simNodes]));

    return () => {
      sim.stop();
    };
  }, [participants]);

  return (
    <div className={`${s.decisionUsers} ${className}`} ref={ref}>
      {roomId &&
        nodes.map((user) => (
          <DecisionUserCard
            key={user.uid}
            roomId={roomId}
            uid={user.uid}
            user={user}
            x={user.x ?? 0}
            y={user.y ?? 0}
          />
        ))}
    </div>
  );
};

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
      <div className={`${s.decisionUsers} ${s.left}`}>
        {roomId && (
          <DecisionUserBoard
            participants={participants.filter((user) => user.decision === "L")}
            roomId={roomId}
            className={s.left}
          />
        )}
      </div>
      <div className={`${s.decisionUsers} ${s.right}`}>
        {roomId && (
          <DecisionUserBoard
            participants={participants.filter((user) => user.decision === "R")}
            roomId={roomId}
            className={s.right}
          />
        )}
      </div>

      {/* == absolute 영역 == */}
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
      {/* == absolute 영역 == */}
    </div>
  );
};
