import avatar from "@assets/images/avatar.svg";
import { useRTDBValue } from "@utils/useRTDBValue";
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

interface AdminUserCardProps {
  roomId: string;
  uid: string;
  user: RoomParticipant;
}

// 방 참가자(관리자용): decision 구독 + 변경 + 킥
export const AdminUserCard = ({ roomId, uid, user }: AdminUserCardProps) => {
  const basePath = `/roomsParticipants/${roomId}/${uid}`;
  const { value: decision } = useRTDBValue<Decision | null>(
    `${basePath}/decision`
  );
  const writer = useRTDBWrite(basePath);

  const setDecision = async (value: Decision) => {
    await writer.setAt("decision", value);
  };
  const kick = async () => {
    await writer.remove();
  };

  const current = decision ?? "";

  const DecisionBadge = ({ d }: { d: Decision }) => (
    <div className={s.decisionChosen}>{d === "" ? "" : d}</div>
  );

  return (
    <div className={s.container}>
      <div
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
        <div
          className={s.userImage}
          style={{
            backgroundImage: `url(${user.photoURL})`,
          }}
        >
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
        </div>
      </div>
    </div>
  );
};
