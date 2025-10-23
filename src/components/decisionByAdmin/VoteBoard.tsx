import { CircleButton } from "@components/atoms/Buttons";
import { RouletteForDraw } from "@components/decisionByAdmin/vote/RouletteForDraw";
import { DecisionUserCard } from "@components/decisionByAdmin/vote/UserItem";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { transition } from "@ssgoi/react";
import { fly } from "@ssgoi/react/transitions";
import { useRTDBList } from "@utils/useRTDBList";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import s from "./VoteBoard.module.scss";

type Result = "L" | "R" | "DRAW" | "";

const DecisionUserBoard = memo(
  ({
    participants,
    className,
    roomId,
    decision,
    result,
  }: {
    participants: RoomParticipant[];
    className?: string;
    roomId: string;
    decision: Decision;
    result: Result;
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

    const isLose = useMemo(() => {
      return result !== "" && result !== "DRAW" && decision !== result;
    }, [decision, result]);

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
        {isLose && <div className={s.lose} />}
      </div>
    );
  }
);

const ResultScreen = ({
  result,
  rouletteBonus,
  setRouletteBonus,
}: {
  result: Result;
  rouletteBonus: "L" | "R" | null;
  setRouletteBonus: React.Dispatch<React.SetStateAction<"L" | "R" | null>>;
}) => {
  const cardTransition = transition({
    key: "user-card",
    ...fly({
      opacity: 0,
      x: 0,
      y: 10,
    }),
  });
  const resultMap: Record<"L" | "R" | "DRAW" | "", string> = {
    L: `LEFT\nWIN`,
    R: `RIGHT\nWIN`,
    DRAW: `DRAW`,
    "": "",
  };

  useEffect(() => {
    if (result !== "DRAW") {
      setRouletteBonus(null);
    }
  }, [result, setRouletteBonus]);

  return (
    <div
      className={`${s.resultScreen} ${s[result]} ${s[rouletteBonus ?? ""]}`}
      ref={cardTransition}
    >
      <div className={`${s.result} ${s[result]} ${s[rouletteBonus ?? ""]}`}>
        {resultMap[rouletteBonus ?? ""] || resultMap[result]}
      </div>
      {result === "DRAW" && (
        <RouletteForDraw setResultValue={setRouletteBonus} />
      )}
    </div>
  );
};

export const VoteBoard = () => {
  const { roomId } = useParams();
  const [isResultVisible, setIsResultVisible] = useState(true);
  const [rouletteBonus, setRouletteBonus] = useState<"L" | "R" | null>(null);
  const navigate = useNavigate();
  const { array: participants } = useRTDBList<RoomParticipant>(
    roomId ? `/roomsParticipants/${roomId}` : null
  );
  const { updateMulti } = useRTDBWrite();
  const leftUser = useMemo(() => {
    return participants.filter((user) => user.decision === "L");
  }, [participants]);
  const rightUser = useMemo(() => {
    return participants.filter((user) => user.decision === "R");
  }, [participants]);

  // 참가자 투표 결과 + 룰렛 보너스 합계
  const resultValue = useMemo(() => {
    const voteL = leftUser.length;
    const voteR = rightUser.length;
    return {
      L: voteL,
      R: voteR,
    };
  }, [leftUser, rightUser]);

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
      setIsResultVisible(true);
      setRouletteBonus(null);
    } catch (e) {
      console.error(e);
      alert("투표 초기화 중 오류가 발생했습니다.");
    }
  };

  const result = useMemo(() => {
    const { L, R } = resultValue;

    const undecidedCount = participants.filter(
      (user) => user.decision === ""
    ).length;

    if (undecidedCount > 0 || participants.length === 0) return "";
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
            participants={leftUser}
            roomId={roomId}
            className={s.left}
            decision="L"
            result={result}
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
            participants={rightUser}
            roomId={roomId}
            className={s.right}
            decision="R"
            result={result}
          />
        )}
      </div>

      {/* == absolute 영역 == */}
      <CircleButton className={s.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeftIcon width={20} />
      </CircleButton>

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
        <ArrowPathIcon width={20} />
      </CircleButton>
      {result && (
        <CircleButton
          className={s.visibleBtn}
          onClick={() => {
            setIsResultVisible((prev) => !prev);
          }}
        >
          {isResultVisible ? (
            <EyeIcon width={20} />
          ) : (
            <EyeSlashIcon width={20} />
          )}
        </CircleButton>
      )}
      {result && isResultVisible && (
        <ResultScreen
          result={result}
          rouletteBonus={rouletteBonus}
          setRouletteBonus={setRouletteBonus}
        />
      )}
      {/* == absolute 영역 == */}
    </div>
  );
};
