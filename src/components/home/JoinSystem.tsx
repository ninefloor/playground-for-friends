import { Button } from "@components/atoms/Buttons";
import { useRealtimeDB } from "@utils/useRealtimeDB";
import { useNavigate } from "react-router-dom";
import s from "./JoinSystem.module.scss";

export const JoinSystem = ({ userName }: { userName: string }) => {
  const { data } = useRealtimeDB("/activeAdmin", false);
  const navigate = useNavigate();

  const movePageHandler = () => {
    navigate(`/${data?.type}`);
  };

  return (
    <div className={s.container}>
      <div className={s.desc}></div>
      <Button disabled={data ? !data.join : true} onClick={movePageHandler}>
        {data?.join ? `join ${data?.type}` : "not ready"}
      </Button>
    </div>
  );
};
