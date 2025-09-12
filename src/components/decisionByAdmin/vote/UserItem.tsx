import avatar from "@assets/images/avatar.svg";
import { type MouseEvent } from "react";
import s from "./UserItem.module.scss";

export const UserItem = ({ user, picks, setPicks, setAttend, push, kick }) => {
  const { username, order } = user;

  const decisionHandler = ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    console.log(id);
  };

  const kickHandler = ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    console.log(id);
  };

  const Decision = ({ decision }) => {
    return (
      <div className={s.decisionChosen}>
        {decision === "giveup" ? "💀" : decision}
      </div>
    );
  };

  return (
    <div className={s.container}>
      <div
        className={
          `${s.user} ` +
          (picks[username] === "L"
            ? s["pick-L"]
            : picks[username] === "R"
            ? s["pick-R"]
            : picks[username] === "giveup"
            ? s["pick-giveup"]
            : "")
        }
      >
        <div className={s.decision}>
          <Decision decision={picks[username]} />
        </div>
        <div
          className={s.textBg}
          style={{
            background: `linear-gradient(115deg, rgba(0, 0, 0, 0) 20%, ${user.color} 100%)`,
          }}
        />
        <button className={s.text} onClick={kickHandler} id={username}>
          {username}
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
              onClick={decisionHandler}
            >
              L
            </button>
            <button
              id="R"
              className={`${s.btn} ${s.R}`}
              onClick={decisionHandler}
            >
              R
            </button>
            <button
              id="giveup"
              className={`${s.btn} ${s.giveup}`}
              onClick={decisionHandler}
            >
              GIVE UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type BasicUser = Pick<UserInfo, "nickname" | "photoURL" | "color">;
interface UserItemPreviewProps {
  user: BasicUser;
}

export const UserItemPreview = ({ user }: UserItemPreviewProps) => {
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
