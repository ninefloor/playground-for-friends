import { Button } from "@components/atoms/Buttons";
import { Input } from "@components/atoms/Input";
import { DefaultModal } from "@components/DefaultModal";
import { sha256 } from "@utils/hash";
import { useHeader } from "@utils/useHeader";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useRTDBList } from "@utils/useRTDBList";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import { useAtomValue } from "jotai";
import { overlay, type OverlayControllerComponent } from "overlay-kit";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./AdminRooms.module.scss";

export const AdminRooms = () => {
  useHeader({
    title: "방 관리",
  });

  const openHandler = () =>
    overlay.open((overlayProps) => <CreateRoomModal {...overlayProps} />);

  return (
    <div className={s.container}>
      <div style={{ display: "flex", gap: 8 }}>
        <Button onClick={() => openHandler()} variant="secondary">
          방 생성
        </Button>
      </div>

      <RoomsList />
    </div>
  );
};

const RoomsList = () => {
  const navigate = useNavigate();
  const { object: roomsObject } = useRTDBList<RoomMeta>("/rooms");
  // 모든 방 참가자 맵을 한 번에 구독하여 방별 인원수 집계(구독 수 최소화)
  const { object: participantsByRoom } =
    useRTDBList<RTDBMap<RoomParticipant>>("/roomsParticipants");
  const writer = useRTDBWrite();

  const sorted = useMemo(() => {
    const entries = Object.entries(roomsObject) as [string, RoomMeta][];
    return entries.sort(
      (a, b) => (b[1].createdAt ?? 0) - (a[1].createdAt ?? 0)
    );
  }, [roomsObject]);

  const removeRoom = async (roomId: string) => {
    if (!confirm("해당 방을 삭제할까요? (참여자 목록도 함께 삭제됩니다)"))
      return;
    await writer.updateMulti({
      [`/rooms/${roomId}`]: null,
      [`/roomsParticipants/${roomId}`]: null,
    });
  };

  return (
    <div className={s.roomsContainer}>
      {sorted.length === 0 ? (
        <p>생성된 방이 없습니다.</p>
      ) : (
        <div className={s.roomsList}>
          {sorted.map(([key, value]) => {
            const count =
              participantsByRoom && participantsByRoom[key]
                ? Object.keys(
                    participantsByRoom[key] as RTDBMap<RoomParticipant>
                  ).length
                : 0;
            return (
              <div key={key} className={s.roomRow}>
                <div className={s.roomInfo}>
                  <div className={s.roomTitle}>{value.title}</div>
                  <div className={s.roomMeta}>
                    <span>{new Date(value.createdAt).toLocaleString()}</span>
                    <span className={s.dot}>•</span>
                    <span>{count} 명</span>
                  </div>
                </div>
                <div className={s.roomActions}>
                  <Button
                    variant="info"
                    onClick={() => navigate(`/room/${key}/admin`)}
                  >
                    참여
                  </Button>
                  <Button variant="danger" onClick={() => removeRoom(key)}>
                    삭제
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CreateRoomModal: OverlayControllerComponent = (props) => {
  const navigate = useNavigate();
  const user = useAtomValue(userInfoAtom);
  const { push: pushRoom } = useRTDBWrite("/rooms");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  return (
    <DefaultModal {...props}>
      <h2 style={{ marginTop: 0 }}>방 생성</h2>
      <div className={s.formContainer}>
        <div className={s.field}>
          <Input
            id="room-title"
            label="방 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="방 제목을 입력하세요"
          />
        </div>
        <div className={s.field}>
          <Input
            label="방 설명"
            id="room-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="방 설명을 입력하세요"
          />
        </div>
        <div className={s.field}>
          <Input
            label="비밀번호"
            id="room-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (없으면 비워두기)"
          />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="tertiary" onClick={() => close()}>
            닫기
          </Button>
          <Button
            onClick={async () => {
              if (!title.trim()) {
                alert("방 제목을 입력하세요.");
                return;
              }
              setCreating(true);
              try {
                const passwordHash = password ? await sha256(password) : null;
                const key = await pushRoom({
                  title: title.trim(),
                  description: description.trim() || undefined,
                  passwordHash,
                  adminUid: user?.uid ?? "",
                  createdAt: Date.now(),
                  status: "open",
                });
                setTitle("");
                setDescription("");
                setPassword("");
                props.close();
                props.unmount();
                if (key) navigate(`/room/${key}/admin`);
              } catch {
                alert("방 생성 중 오류가 발생했습니다.");
              } finally {
                setCreating(false);
              }
            }}
            disabled={creating}
          >
            {creating ? "생성 중..." : "생성"}
          </Button>
        </div>
      </div>
    </DefaultModal>
  );
};
