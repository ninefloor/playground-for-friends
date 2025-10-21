import logo from "@assets/images/pff.svg";
import { Button } from "@components/atoms/Buttons";
import { Login } from "./Login";
import s from "./UnauthenticatedHome.module.scss";

export const UnauthenticatedHome = () => {
  const pcUserHander = () => {
    window.open(
      window.location.href,
      "_blank",
      "popup=true, scrollbars=0, location=0"
    );
  };

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
      <Button className={s.pcBtn} variant="black" onClick={pcUserHander} inline>
        PC Ver.
      </Button>
      <Login />
    </>
  );
};
