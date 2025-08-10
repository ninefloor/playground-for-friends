import { Button } from "@components/atoms/Buttons";
import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Admin.module.scss";

export const Admin = () => {
  const navigate = useNavigate();

  const routeHandler = ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    navigate(`/admin/${id}`);
  };
  return (
    <div className={s.container}>
      <h1>hello, nine</h1>
      <Button id="vote" onClick={routeHandler}>
        launch Vote
      </Button>
      <Button id="tier" onClick={routeHandler}>
        launch Tier
      </Button>
      <Button id="members" onClick={routeHandler}>
        members
      </Button>
    </div>
  );
};
