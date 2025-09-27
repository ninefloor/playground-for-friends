import { Button, CircleButton } from "@components/atoms/Buttons";
import { RouletteForDraw } from "@components/decisionByAdmin/vote/RouletteForDraw";
import { DecisionUserCard } from "@components/decisionByAdmin/vote/UserItem";
import { useRTDBList } from "@utils/useRTDBList";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { useEffect, useMemo, useRef, useState } from "react";
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
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    }));
    console.log(width, height);
    const sim = forceSimulation(simNodes)
      .force("center", forceCenter(width / 2, height / 2).strength(0.5))
      .force("collide", forceCollide(40).strength(0.8).iterations(2))
      .force(
        "charge",
        forceManyBody().strength(-40).distanceMin(40).distanceMax(140)
      )
      .alpha(0.7)
      .alphaDecay(0.018)
      .velocityDecay(0.28)
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
  const [rouletteBonus, setRouletteBonus] = useState({ L: 0, R: 0 });
  const [isFRVisible, setIsFRVisible] = useState(false);
  const navigate = useNavigate();
  const { array: participants } = useRTDBList<RoomParticipant>(
    roomId ? `/roomsParticipants/${roomId}` : null
  );
  const { updateMulti } = useRTDBWrite();

  // 참가자 투표 결과 + 룰렛 보너스 합계
  const resultValue = useMemo(() => {
    const voteL = participants.filter((u) => u.decision === "L").length;
    const voteR = participants.filter((u) => u.decision === "R").length;
    return {
      L: voteL + rouletteBonus.L,
      R: voteR + rouletteBonus.R,
    };
  }, [participants, rouletteBonus]);

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
      // 룰렛 보너스도 초기화
      setRouletteBonus({ L: 0, R: 0 });
    } catch (e) {
      console.error(e);
      alert("투표 초기화 중 오류가 발생했습니다.");
    }
  };

  const result = useMemo(() => {
    const { L, R } = resultValue;

    // 아직 투표하지 않은 사용자가 있으면 결과를 보여주지 않음
    const undecidedCount = participants.filter(
      (user) => user.decision === ""
    ).length;

    if (undecidedCount > 0) return "";
    if (L > R) return "L";
    if (L < R) return "R";
    if (L === R) return "DRAW";
    return "";
  }, [resultValue, participants]);

  return (
    <div className={s.container}>
      <div className={s.decisionUsersContainer}>
        {roomId && (
          <DecisionUserBoard
            participants={participants.filter((user) => user.decision === "L")}
            roomId={roomId}
            className={s.left}
          />
        )}

        <div className={`${s.decisionUsers} ${s.center}`}>
          {roomId &&
            participants
              .filter((user) => ["", "GIVE_UP"].includes(user.decision))
              .map((user) => (
                <DecisionUserCard
                  key={user.uid}
                  roomId={roomId}
                  uid={user.uid}
                  user={user}
                />
              ))}
        </div>

        {roomId && (
          <DecisionUserBoard
            participants={participants.filter((user) => user.decision === "R")}
            roomId={roomId}
            className={s.right}
          />
        )}
      </div>

      {/* == absolute 영역 == */}
      {result && <div className={s.result}>{result}</div>}
      <Button
        className={s.backBtn}
        variant="black"
        onClick={() => navigate(-1)}
        inline
      >
        BACK
      </Button>
      {isFRVisible && <RouletteForDraw setResultValue={setRouletteBonus} />}

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
