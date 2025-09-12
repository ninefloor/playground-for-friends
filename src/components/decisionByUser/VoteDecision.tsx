import { Button, DecisionButton } from "@components/atoms/Buttons";
import { DecisionViewer } from "@components/decisionByUser/DecisionViewer";
import { realtimeDB } from "@utils/firebase";
import { useRTDBValue } from "@utils/useRTDBValue";
import { userInfoAtom } from "@utils/userInfoAtom";
import { DataSnapshot, get, onDisconnect, ref } from "firebase/database";
import { useAtomValue } from "jotai";
import { type MouseEvent, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import s from "./DecisionComponents.module.scss";
import { useRTDBWrite } from "@utils/useRTDBWrite";

export const VoteDecision = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const decisionPath =
    userInfo && roomId
      ? `/roomsParticipants/${roomId}/${userInfo.uid}/decision`
      : undefined;
  const { value: currentDecision } = useRTDBValue<Decision | null>(decisionPath);
  const writer = useRTDBWrite(
    userInfo && roomId ? `/roomsParticipants/${roomId}/${userInfo.uid}` : undefined
  );

  // 참가자 문서 생성 및 onDisconnect 설정
  // 기존 데이터가 있으면 보존하고, 없으면 기본값으로 생성
  useEffect(() => {
    if (!userInfo || !roomId) return;
    const basePath = `/roomsParticipants/${roomId}/${userInfo.uid}`;
    const userRef = ref(realtimeDB, basePath);

    (async () => {
      const snap: DataSnapshot = await get(userRef);
      const prev = (snap.val() as RoomParticipant | null) ?? null;
      const next: RoomParticipant =
        prev ?? {
          uid: userInfo.uid,
          nickname: userInfo.nickname,
          photoURL: userInfo.photoURL,
          color: userInfo.color,
          role: userInfo.role === "ADMIN" ? "ADMIN" : "PARTICIPANT",
          joinedAt: Date.now(),
          decision: "",
        };
      await writer.set(next);
      onDisconnect(userRef).remove();
    })();

    // onDisconnect는 연결 끊김에 반응하므로 추가적인 cleanup은 생략
  }, [userInfo, roomId]);

  const decisionHandler = async ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    if (!userInfo || !roomId) return;
    await writer.setAt("decision", id as Decision);
  };

  return (
    <div className={s.container}>
      <Button
        className={s.backBtn}
        variant="black"
        onClick={() => (roomId ? navigate(`/room/${roomId}`) : navigate(-1))}
        inline
      >
        BACK
      </Button>
      <h1 className={s.title}>{userInfo?.nickname}'s decision</h1>
      <DecisionViewer decision={currentDecision ?? ""} />
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
