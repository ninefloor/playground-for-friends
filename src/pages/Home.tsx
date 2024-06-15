import logo from "@assets/images/logo.png";
import s from "./Home.module.scss";
import { BlackBtn } from "@components/atoms/Buttons";
import { Login } from "@components/home/Login";
import { useRecoilValue } from "recoil";
import userInfo from "@utils/userInfo";
import { JoinSystem } from "@components/home/JoinSystem";

export const Home = () => {
  const pcUserHander = () => {
    window.open(
      window.location.href,
      "_blank",
      "popup=true, scrollbars=0, location=0"
    );
  };
  const user = useRecoilValue(userInfo);
  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  return (
    <div className={s.container}>
      <img src={logo} alt="logo" />
      <h1 className={s.title}>
        playground
        <br />
        for
        <br />
        honeyz
      </h1>
      {adminId === user.userId && (
        <BlackBtn className={s.adminBtn}>ADMIN</BlackBtn>
      )}
      <BlackBtn className={s.pcBtn} onClick={pcUserHander}>
        PC Ver.
      </BlackBtn>
      {user.name ? <JoinSystem userName={user.name} /> : <Login />}
    </div>
  );
};
