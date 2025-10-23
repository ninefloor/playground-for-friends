import { Button } from "@components/atoms/Buttons";
import { ItemList } from "@components/atoms/ItemList";
import { DefaultModal } from "@components/DefaultModal";
import { LayoutLoading } from "@components/Loading";
import { RoomInfo } from "@components/room/RoomInfo";
import { useHeader } from "@utils/useHeader";
import { useRTDBList } from "@utils/useRTDBList";
import { overlay } from "overlay-kit";
import { useMemo } from "react";
import s from "./Lobby.module.scss";

export const Lobby = () => {
  useHeader({
    title: "로비",
  });
  const { object: roomsObject, isLoading } = useRTDBList<RoomMeta>("/rooms");

  const sortedRooms = useMemo(() => {
    const entries = Object.entries(roomsObject) as [string, RoomMeta][];
    return entries.sort(
      (a, b) => (b[1].createdAt ?? 0) - (a[1].createdAt ?? 0)
    );
  }, [roomsObject]);

  const openRoomInfo = (roomId: string) =>
    overlay.open((props) => (
      <DefaultModal {...props}>
        <RoomInfo roomId={roomId} close={props.close} />
      </DefaultModal>
    ));

  return (
    <div className={s.container}>
      <ItemList className={s.list}>
        {isLoading ? (
          <LayoutLoading backgroundColor="dark" />
        ) : (
          sortedRooms.map(([key, value]) => (
            <ItemList.Row key={key} className={s.item}>
              <div>
                <div className={s.title}>{value.title}</div>
                {value.description && <div>{value.description}</div>}
              </div>
              <Button onClick={() => openRoomInfo(key)} inline>
                보기
              </Button>
            </ItemList.Row>
          ))
        )}
        {!isLoading && sortedRooms.length === 0 && (
          <div>생성된 방이 없습니다.</div>
        )}
      </ItemList>
    </div>
  );
};
