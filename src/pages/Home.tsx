import logo from "@assets/images/pff.svg";
import { Button } from "@components/atoms/Buttons";
import { DecisionUserCard } from "@components/decisionByAdmin/vote/UserItem";
import { Login } from "@components/home/Login";
import { auth } from "@utils/firebase";
import { userInfoAtom } from "@utils/userInfoAtom";
import { signOut } from "firebase/auth";
import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useNavigate } from "react-router-dom";
import s from "./Home.module.scss";

export const Home = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const resetUserInfo = useResetAtom(userInfoAtom);
  const navigate = useNavigate();
  const pcUserHander = () => {
    window.open(
      window.location.href,
      "_blank",
      "popup=true, scrollbars=0, location=0"
    );
  };

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

  const profileHandler = () => {
    navigate("/profile");
  };
  const lobbyHandler = () => {
    navigate("/lobby");
  };

  return (
    <div className={s.container}>
      {/* {userInfo ? <UserCard user={userInfo} /> : <img src={logo} alt="logo" />} */}
      {userInfo ? (
        <DecisionUserCard
          user={{
            uid: userInfo.uid,
            nickname: userInfo.nickname,
            photoURL: userInfo.photoURL,
            color: userInfo.color,
            role: "PARTICIPANT",
            joinedAt: Date.now(),
            decision: "",
          }}
          roomId="test"
          uid="test"
        />
      ) : (
        <img src={logo} alt="logo" />
      )}
      <h1 className={s.title}>
        playground
        <br />
        for
        <br />
        friends
      </h1>
      {userInfo?.role === "ADMIN" && (
        <Button
          className={s.adminBtn}
          variant="black"
          onClick={adminHandler}
          inline
        >
          ADMIN
        </Button>
      )}
      {userInfo && (
        <Button
          className={s.logoutBtn}
          variant="black"
          onClick={logoutHandler}
          inline
        >
          Logout
        </Button>
      )}
      {userInfo && (
        <Button variant="primary" onClick={lobbyHandler} inline>
          Join Rooms
        </Button>
      )}
      {userInfo && (
        <Button variant="black" onClick={profileHandler} inline>
          My Profile
        </Button>
      )}
      <Button className={s.pcBtn} variant="black" onClick={pcUserHander} inline>
        PC Ver.
      </Button>
      {!userInfo && <Login />}
    </div>
  );
};
