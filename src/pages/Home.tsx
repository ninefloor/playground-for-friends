import logo from "@assets/images/logo.png";
import { BlackBtn } from "@components/atoms/Buttons";
import { JoinSystem } from "@components/home/JoinSystem";
import { Login } from "@components/home/Login";
import { auth } from "@utils/firebase";
import userInfo from "@utils/userInfoAtom";
import { signOut } from "firebase/auth";
import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useNavigate } from "react-router-dom";
import s from "./Home.module.scss";

export const Home = () => {
  const { userId, name } = useAtomValue(userInfo);
  const resetUserInfo = useResetAtom(userInfo);
  const navigate = useNavigate();
  const pcUserHander = () => {
    window.open(
      window.location.href,
      "_blank",
      "popup=true, scrollbars=0, location=0"
    );
  };
  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      resetUserInfo();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const adminHandler = () => {
    navigate("/admin");
  };

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
      {adminId === userId && (
        <BlackBtn className={s.adminBtn} onClick={adminHandler}>
          ADMIN
        </BlackBtn>
      )}
      {userId && (
        <BlackBtn className={s.logoutBtn} onClick={logoutHandler}>
          Logout
        </BlackBtn>
      )}
      <BlackBtn className={s.pcBtn} onClick={pcUserHander}>
        PC Ver.
      </BlackBtn>
      {name ? <JoinSystem userName={name} /> : <Login />}
    </div>
  );
};
