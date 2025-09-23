import { Button } from "@components/atoms/Buttons";
import type { MouseEvent } from "react";
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
      <Button
        className={s.backBtn}
        variant="black"
        onClick={() => navigate("/")}
        inline
      >
        BACK
      </Button>
      <h1>hello, nine</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <Button id="members" onClick={routeHandler}>
          members
        </Button>
        <Button id="rooms" onClick={routeHandler}>
          Rooms
        </Button>
      </div>
    </div>
  );
};
