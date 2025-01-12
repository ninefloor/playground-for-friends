import { MouseEvent } from "react";
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
      <div className="decisionChosen">
        {decision === "giveup" ? "💀" : decision}
      </div>
    );
  };

  return (
    <div className={s.container}>
      <div className={s.user}>
        <div className="decision">
          <Decision decision={picks[username]} />
        </div>
        <div className="textBg" />
        <button className="text" onClick={kickHandler} id={username}>
          {username}
        </button>
        <div className="userImage">
          <div className="decisionBtn">
            <button id="L" className="L btn" onClick={decisionHandler}>
              L
            </button>
            <button id="R" className="R btn" onClick={decisionHandler}>
              R
            </button>
            <button
              id="giveup"
              className="giveup btn"
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
