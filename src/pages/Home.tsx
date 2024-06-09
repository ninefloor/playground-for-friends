import logo from "@assets/images/logo.png";
import s from "./Home.module.scss";
import { BlackBtn } from "@components/atoms/Buttons";
import { Login } from "@components/Login";

export const Home = () => {
  const pcUserHander = () => {
    window.open(
      window.location.href,
      "_blank",
      "popup=true, scrollbars=0, location=0"
    );
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
      <BlackBtn className={s.adminBtn}>ADMIN</BlackBtn>
      <BlackBtn className={s.pcBtn} onClick={pcUserHander}>
        PC Ver.
      </BlackBtn>
      <Login />
    </div>
  );
};
