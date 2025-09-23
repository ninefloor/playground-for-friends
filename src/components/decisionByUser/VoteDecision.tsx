import { Button, DecisionButton } from "@components/atoms/Buttons";
import { DecisionViewer } from "@components/decisionByUser/DecisionViewer";
import { realtimeDB } from "@utils/firebase";
import { useRTDBValue } from "@utils/useRTDBValue";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import { userInfoAtom } from "@utils/userInfoAtom";
import { DataSnapshot, get, onDisconnect, ref } from "firebase/database";
import { useAtomValue } from "jotai";
import { type MouseEvent, useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import s from "./DecisionComponents.module.scss";

export const VoteDecision = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const decisionPath =
    userInfo && roomId
      ? `/roomsParticipants/${roomId}/${userInfo.uid}/decision`
      : undefined;
  const { value: currentDecision } = useRTDBValue<Decision | null>(
    decisionPath
  );
  const writer = useRTDBWrite(
    userInfo && roomId
      ? `/roomsParticipants/${roomId}/${userInfo.uid}`
      : undefined
  );
  const { value: roomMeta, loaded: roomLoaded } = useRTDBValue<RoomMeta | null>(
    roomId ? `/rooms/${roomId}` : null
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
      const next: RoomParticipant = prev ?? {
        uid: userInfo.uid,
        nickname: userInfo.nickname,
        photoURL: userInfo.photoURL,
        color: userInfo.color,
        role: userInfo.role === "ADMIN" ? "ADMIN" : "PARTICIPANT",
        joinedAt: Date.now(),
        customOrder: userInfo.customOrder,
        decision: "",
      };
      await writer.set(next);
      onDisconnect(userRef).remove();
    })();

    // 라우트 이탈(소프트 퇴장) 시에도 즉시 제거
    return () => {
      // 중복 제거: 다른 경로로 이미 퇴장 처리되었다면 skip
      if (leavingRef.current) return;
      writer.remove().catch(() => undefined);
    };
  }, [userInfo, roomId, writer]);

  const leavingRef = useRef(false);

  const leaveRoom = useCallback(async () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    if (!userInfo || !roomId) return;
    try {
      await writer.remove();
    } finally {
      navigate(`/lobby`);
    }
  }, [userInfo, roomId, writer, navigate]);

  // 방이 삭제되었거나 닫힌 경우 자동 퇴장 처리
  useEffect(() => {
    if (!roomId || !userInfo) return;
    if (!roomLoaded) return;
    if (!roomMeta) {
      // 방 문서가 삭제됨
      void leaveRoom();
      return;
    }
    if (roomMeta.status === "closed") {
      void leaveRoom();
    }
  }, [roomLoaded, roomMeta, roomId, userInfo, leaveRoom]);

  const decisionHandler = async ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    if (!userInfo || !roomId) return;
    await writer.setAt("decision", id as Decision);
  };

  return (
    <div className={s.container}>
      <Button className={s.backBtn} variant="black" onClick={leaveRoom} inline>
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
