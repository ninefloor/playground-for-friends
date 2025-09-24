import avatar from "@assets/images/avatar.svg";
import { useContextMenu } from "@components/atoms/ContextMenu";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import s from "./UserItem.module.scss";

type BasicUser = Pick<UserInfo, "nickname" | "photoURL" | "color">;
interface UserCardProps {
  user: BasicUser;
}

export const UserCard = ({ user }: UserCardProps) => {
  const { nickname } = user;

  const isIncludeKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(nickname);

  return (
    <div className={s.container}>
      <div className={s.user}>
        {user.photoURL ? (
          <div
            className={s.userImage}
            style={{
              backgroundImage: `url(${user.photoURL})`,
            }}
          />
        ) : (
          <img className={s.userImage} src={avatar} alt="avatar" />
        )}
        <div
          className={s.textBg}
          style={{
            background: `linear-gradient(115deg, rgba(0, 0, 0, 0) 20%, ${user.color} 100%)`,
          }}
        />
        <div className={`${s.text} ${isIncludeKorean ? s.korean : ""}`}>
          {nickname}
        </div>
      </div>
    </div>
  );
};

interface DecisionUserCardProps {
  roomId: string;
  uid: string;
  user: RoomParticipant;
}

export const WaitingUserCard = ({
  roomId,
  uid,
  user,
}: DecisionUserCardProps) => {
  const basePath = `/roomsParticipants/${roomId}/${uid}`;
  const writer = useRTDBWrite(basePath);
  const { nickname } = user;
  const { openAtEvent, Menu } = useContextMenu();

  const isIncludeKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(nickname);

  const setDecision = async (value: Decision) => {
    await writer.setAt("decision", value);
  };
  const kick = async () => {
    await writer.remove();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    openAtEvent(e, [
      { key: "L", label: "L", onSelect: () => setDecision("L") },
      { key: "R", label: "R", onSelect: () => setDecision("R") },
      {
        key: "GIVE_UP",
        label: "GIVE_UP",
        onSelect: () => setDecision("GIVE_UP"),
      },
      { key: "CLEAR", label: "CLEAR", onSelect: () => setDecision("") },
      { key: "KICK", label: "KICK", onSelect: kick, danger: true },
    ]);
  };

  return (
    <div className={s.container} onClick={handleClick}>
      <div className={s.user}>
        {user.photoURL ? (
          <div
            className={s.userImage}
            style={{
              backgroundImage: `url(${user.photoURL})`,
            }}
          />
        ) : (
          <img className={s.userImage} src={avatar} alt="avatar" />
        )}
        <div
          className={s.textBg}
          style={{
            background: `linear-gradient(115deg, rgba(0, 0, 0, 0) 20%, ${user.color} 100%)`,
          }}
        />
        <div className={`${s.text} ${isIncludeKorean ? s.korean : ""}`}>
          {nickname}
        </div>
      </div>
      {/* <div
        className={`${s.user} ${
          current === "L"
            ? s.L
            : current === "R"
            ? s.R
            : current === "GIVE_UP"
            ? s.giveup
            : ""
        }`}
      >
        <div className={s.decision}>
          <DecisionBadge d={current} />
        </div>
        <div
          className={s.textBg}
          style={{
            background: `linear-gradient(115deg, rgba(0, 0, 0, 0) 20%, ${user.color} 100%)`,
          }}
        />
        <button className={s.text} onClick={kick} id={uid}>
          {user.nickname}
        </button>
        {user.photoURL ? (
          <div
            className={s.userImage}
            style={{
              backgroundImage: `url(${user.photoURL})`,
            }}
          />
        ) : (
          <img className={s.userImage} src={avatar} alt="avatar" />
        )}
        <div className={s.decisionBtn}>
            <button
              id="L"
              className={`${s.btn} ${s.L}`}
              onClick={() => setDecision("L")}
            >
              L
            </button>
            <button
              id="R"
              className={`${s.btn} ${s.R}`}
              onClick={() => setDecision("R")}
            >
              R
            </button>
            <button
              id="GIVE_UP"
              className={`${s.btn} ${s.giveup}`}
              onClick={() => setDecision("")}
            >
              CLEAR
            </button>
          </div>
      </div> */}
      <Menu />
    </div>
  );
};

export const DecisionUserCard = ({
  roomId,
  uid,
  user,
}: DecisionUserCardProps) => {
  const basePath = `/roomsParticipants/${roomId}/${uid}`;
  const writer = useRTDBWrite(basePath);
  const { nickname } = user;
  const { openAtEvent, Menu } = useContextMenu();

  const isIncludeKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(nickname);

  const setDecision = async (value: Decision) => {
    await writer.setAt("decision", value);
  };
  const kick = async () => {
    await writer.remove();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    openAtEvent(e, [
      { key: "L", label: "L", onSelect: () => setDecision("L") },
      { key: "R", label: "R", onSelect: () => setDecision("R") },
      {
        key: "GIVE_UP",
        label: "GIVE_UP",
        onSelect: () => setDecision("GIVE_UP"),
      },
      { key: "CLEAR", label: "CLEAR", onSelect: () => setDecision("") },
      { key: "KICK", label: "KICK", onSelect: kick, danger: true },
    ]);
  };

  // TODO: d3-force 시각화와 결합 시 이 메뉴 트리거를 적절한 노드에 연결
  return (
    <div className={s.container} onClick={handleClick}>
      <div className={s.user}>
        {user.photoURL ? (
          <div
            className={s.userImage}
            style={{
              backgroundImage: `url(${user.photoURL})`,
            }}
          />
        ) : (
          <img className={s.userImage} src={avatar} alt="avatar" />
        )}
        <div
          className={s.textBg}
          style={{
            background: `linear-gradient(115deg, rgba(0, 0, 0, 0) 20%, ${user.color} 100%)`,
          }}
        />
        <div className={`${s.text} ${isIncludeKorean ? s.korean : ""}`}>
          {nickname}
        </div>
      </div>
      <Menu />
    </div>
  );
};
