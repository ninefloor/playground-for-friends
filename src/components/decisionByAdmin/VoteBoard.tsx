import { useNavigate } from "react-router-dom";
import s from "./VoteBoard.module.scss";
import { useEffect, useState } from "react";
import { RouletteForDraw } from "@components/decisionByAdmin/vote/RouletteForDraw";
import { CircleButton } from "@components/atoms/Buttons";
import { useUserDecision } from "@utils/useUserDecision";
import { useRealtimeDB } from "@utils/useRealtimeDB";
import { useGetUserData } from "@utils/useGetUserData";

export const VoteBoard = () => {
  const { users, loading } = useGetUserData();
  const [attendUserId, setAttendUserId] = useState<string[]>([]);
  const [picks, setPicks] = useState({});
  const [resultValue, setResultValue] = useState({ L: 0, R: 0 });
  const [result, setResult] = useState("");
  const [isFRVisible, setIsFRVisible] = useState(false);
  const [isShowRoulette, setIsShowRoulette] = useState(false);
  const navigate = useNavigate();
  const { data: attendUser, push: setAttendUser } = useRealtimeDB("/joinUser");
  const { decisions, pushDecisions } = useUserDecision(attendUserId);

  useEffect(() => {
    console.log(users);
    if (attendUser) {
      const { join: curJoin, userId: curUserId } = attendUser;
      if (curJoin)
        setAttendUserId((prev) =>
          prev.includes(curUserId) ? prev : [...prev, curUserId]
        );
      else
        setAttendUserId((prev) =>
          prev.filter((userId) => userId !== curUserId)
        );
    }
  }, [attendUser, loading]);

  return (
    <div className={s.container}>
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
      <CircleButton className={s.refreshBtn} onClick={() => {}}>
        refresh
      </CircleButton>
      <CircleButton
        className={s.prevBtn}
        onClick={() => {
          navigate("/");
        }}
      >
        prev
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
