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

const REACTION_DURATION = 4000;
const REACTION_PRESETS = ["👏", "🔥", "😍", "💯"];

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
  const { value: roomMeta, isLoading } = useRTDBValue<RoomMeta | null>(
    roomId ? `/rooms/${roomId}` : null
  );
  const reactionTimers = useRef<
    { key: string; timer: ReturnType<typeof setTimeout> }[]
  >([]);

  useEffect(() => {
    return () => {
      reactionTimers.current.forEach(({ key, timer }) => {
        clearTimeout(timer);
        if (userInfo && roomId) {
          writer.removeAt(`reactionQueue/${key}`).catch(() => undefined);
        }
      });
      reactionTimers.current = [];
    };
  }, [roomId, userInfo, writer]);

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
    if (isLoading) return;
    if (!roomMeta) {
      // 방 문서가 삭제됨
      void leaveRoom();
      return;
    }
    if (roomMeta.status === "closed") {
      void leaveRoom();
    }
  }, [isLoading, roomMeta, roomId, userInfo, leaveRoom]);

  const decisionHandler = async ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    if (!userInfo || !roomId || currentDecision === "GIVE_UP") return;
    await writer.setAt("decision", id as Decision);
  };

  const sendReaction = useCallback(
    async (emoji: string) => {
      if (!userInfo || !roomId) return;
      try {
        const payload: ReactionPayload = {
          emoji,
          createdAt: Date.now(),
          duration: REACTION_DURATION,
        };
        const key = await writer.pushAt("reactionQueue", payload);
        if (!key) return;

        const timer = setTimeout(() => {
          writer.removeAt(`reactionQueue/${key}`).catch(() => undefined);
          reactionTimers.current = reactionTimers.current.filter(
            (item) => item.key !== key
          );
        }, payload.duration);
        reactionTimers.current.push({ key, timer });
      } catch (error) {
        console.error("failed to send reaction", error);
      }
    },
    [roomId, userInfo, writer]
  );

  return (
    <div className={s.container}>
      <Button className={s.backBtn} variant="black" onClick={leaveRoom} inline>
        BACK
      </Button>
      <h1 className={s.title}>{userInfo?.nickname}'s decision</h1>
      <DecisionViewer decision={currentDecision ?? ""} />
      <div className={s.btns}>
        <DecisionButton
          onClick={decisionHandler}
          id="L"
          className={s.L}
          disabled={currentDecision === "GIVE_UP"}
        >
          L
        </DecisionButton>
        <DecisionButton
          onClick={decisionHandler}
          id="R"
          className={s.R}
          disabled={currentDecision === "GIVE_UP"}
        >
          R
        </DecisionButton>
      </div>
      <div className={s.reactions}>
        {REACTION_PRESETS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={s.reactionBtn}
            onClick={() => sendReaction(emoji)}
            disabled={!userInfo || !roomId}
            aria-label={`send reaction ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
