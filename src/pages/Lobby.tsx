import { Button } from "@components/atoms/Buttons";
import { useRTDBList } from "@utils/useRTDBList";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Lobby.module.scss";

export const Lobby = () => {
  const navigate = useNavigate();
  const { array: rooms } = useRTDBList<RoomMeta>("/rooms");

  // 방 생성은 관리자 전용(Admin 페이지에서만 노출)

  const sortedRooms = useMemo(
    () =>
      [...rooms].sort(
        (a, b) => (b.value.createdAt ?? 0) - (a.value.createdAt ?? 0)
      ),
    [rooms]
  );

  // 생성 기능 제거

  return (
    <div className={s.container}>
      <Button className={s.backBtn} variant="black" onClick={() => navigate("/")} inline>
        BACK
      </Button>
      <div className={s.list}>
        {sortedRooms.map(({ key, value }) => (
          <div key={key} className={s.item}>
            <div>
              <div className={s.title}>{value.title}</div>
              {value.description && <div>{value.description}</div>}
            </div>
            <Button onClick={() => navigate(`/room/${key}`)} inline>
              보기
            </Button>
          </div>
        ))}
        {sortedRooms.length === 0 && <div>생성된 방이 없습니다.</div>}
      </div>
      {/* 방 생성은 Admin 페이지에서만 노출 */}
    </div>
  );
};
