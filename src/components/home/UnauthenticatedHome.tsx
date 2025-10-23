import logo from "@assets/images/pff.svg";
import { Login } from "./Login";
import s from "./UnauthenticatedHome.module.scss";

export const UnauthenticatedHome = () => {
  return (
    <>
      <img src={logo} alt="logo" />
      <h1 className={s.title}>
        playground
        <br />
        for
        <br />
        friends
      </h1>
      <Login />
    </>
  );
};
