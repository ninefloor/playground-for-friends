import { Button } from "@components/atoms/Buttons";
import { Input } from "@components/atoms/Input";
import { UserCard } from "@components/decisionByAdmin/vote/UserItem";
import { Loading } from "@components/Loading";
import { realtimeDB } from "@utils/firebase";
import { sha256 } from "@utils/hash";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useRTDBList } from "@utils/useRTDBList";
import { get, ref } from "firebase/database";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import s from "./Room.module.scss";

export const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useAtomValue(userInfoAtom);
  const [room, setRoom] = useState<RoomMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [pw, setPw] = useState("");
  const [joining, setJoining] = useState(false);

  const participantsPath = useMemo(
    () => (roomId ? `/roomsParticipants/${roomId}` : null),
    [roomId]
  );
  const { array: participants } =
    useRTDBList<RoomParticipant>(participantsPath);

  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId) return;
      const snap = await get(ref(realtimeDB, `/rooms/${roomId}`));
      const data = snap.val() as RoomMeta | null;
      setRoom(data);
      setLoading(false);
    };
    loadRoom();
  }, [roomId]);

  // 참가자 생성/제거는 투표 화면에서 관리(onDisconnect)

  const tryJoin = async () => {
    if (!user || !roomId || !room) return;
    setJoining(true);
    try {
      if (room.passwordHash) {
        const hash = await sha256(pw);
        if (hash !== room.passwordHash) {
          alert("비밀번호가 올바르지 않습니다.");
          return;
        }
      }
      navigate(`/room/${roomId}/vote`);
    } catch {
      alert("입장 처리 중 오류가 발생했습니다.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <Loading />;
  if (!room) return <div className={s.container}>존재하지 않는 방입니다.</div>;

  const isMember = participants.some((p) => p.uid === user?.uid);

  return (
    <div className={s.container}>
      <Button
        className={s.backBtn}
        variant="black"
        onClick={() => navigate("/lobby")}
        inline
      >
        BACK
      </Button>
      <div className={s.card}>
        <h2>{room.title}</h2>
        {room.description && <p>{room.description}</p>}
      </div>

      {!isMember && (
        <div className={s.card}>
          {room.passwordHash ? (
            <div className={s.pwRow}>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <Button onClick={tryJoin} disabled={joining}>
                {joining ? "이동 중..." : "참가"}
              </Button>
            </div>
          ) : (
            <Button onClick={tryJoin} disabled={joining}>
              {joining ? "이동 중..." : "참가"}
            </Button>
          )}
        </div>
      )}

      <div className={s.card}>
        <h3>참가자</h3>
        <div className={s.participants}>
          {participants.map((p) => (
            <UserCard key={p.uid} user={p} />
          ))}
          {participants.length === 0 && <div>아직 참가자가 없습니다.</div>}
        </div>
      </div>

      {isMember && roomId && (
        <Button onClick={() => navigate(`/room/${roomId}/vote`)}>
          입장하기
        </Button>
      )}
    </div>
  );
};
