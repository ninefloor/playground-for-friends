import { Outlet } from "react-router-dom";
import s from "./DefaultLayout.module.scss";

export const DefaultLayout = () => {
  return (
    <div className={s.container}>
      <Outlet />
    </div>
  );
};
