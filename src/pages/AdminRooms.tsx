import { Button } from "@components/atoms/Buttons";
import { Input } from "@components/atoms/Input";
import { sha256 } from "@utils/hash";
import { useRTDBList } from "@utils/useRTDBList";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import { useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Admin.module.scss";

const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", padding: 16, borderRadius: 8, minWidth: 320, maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const RoomsList = () => {
  const navigate = useNavigate();
  const { array: roomsArray } = useRTDBList<RoomMeta>("/rooms");
  // 모든 방 참가자 맵을 한 번에 구독하여 방별 인원수 집계(구독 수 최소화)
  const { items: participantsByRoom } = useRTDBList<RTDBMap<RoomParticipant>>("/roomsParticipants");
  const writer = useRTDBWrite();

  const sorted = useMemo(
    () => [...roomsArray].sort((a, b) => (b.value.createdAt ?? 0) - (a.value.createdAt ?? 0)),
    [roomsArray]
  );

  const removeRoom = async (roomId: string) => {
    if (!confirm("해당 방을 삭제할까요? (참여자 목록도 함께 삭제됩니다)")) return;
    await writer.updateMulti({ [`/rooms/${roomId}`]: null, [`/roomsParticipants/${roomId}`]: null });
  };

  return (
    <div className={s.roomsContainer}>
      {sorted.length === 0 ? (
        <p>생성된 방이 없습니다.</p>
      ) : (
        <div className={s.roomsList}>
          {sorted.map(({ key, value }) => {
            const count = participantsByRoom && participantsByRoom[key]
              ? Object.keys(participantsByRoom[key] as RTDBMap<RoomParticipant>).length
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
                  <Button variant="info" onClick={() => navigate(`/room/${key}/admin`)}>
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

export const AdminRooms = () => {
  const navigate = useNavigate();
  const user = useAtomValue(userInfoAtom);
  const { push: pushRoom } = useRTDBWrite("/rooms");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className={s.container}>
      <Button
        className={s.backBtn}
        variant="black"
        onClick={() => navigate("/admin")}
        inline
      >
        BACK
      </Button>
      <h1>Rooms</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <Button onClick={() => setOpenCreate(true)} variant="secondary">
          방 생성
        </Button>
      </div>

      <RoomsList />

      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
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
            <Button variant="tertiary" onClick={() => setOpenCreate(false)}>
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
                  setOpenCreate(false);
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
      </Modal>
    </div>
  );
};
