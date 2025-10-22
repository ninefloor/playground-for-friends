import { Button } from "@components/atoms/Buttons";
import { DropdownMenu } from "@components/atoms/DropdownMenu";
import { UserCard } from "@components/decisionByAdmin/vote/UserItem";
import { HeaderButton } from "@components/layout/Header";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { auth } from "@utils/firebase";
import { useHeader } from "@utils/useHeader";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import s from "./AuthenticatedHome.module.scss";

export const AuthenticatedHome = ({ userInfo }: { userInfo: UserInfo }) => {
  const navigate = useNavigate();
  const isTouchDevice = window?.matchMedia("(pointer: coarse)")?.matches;

  const logoutHandler = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const profileHandler = () => {
    navigate("/profile");
  };

  const lobbyHandler = () => {
    navigate("/lobby");
  };

  const adminMembersHandler = () => {
    navigate("/admin/members");
  };

  const adminRoomsHandler = () => {
    navigate("/admin/rooms");
  };

  const headerConfig = {
    left: (
      <HeaderButton onClick={logoutHandler}>
        <ArrowLeftStartOnRectangleIcon width={24} height={24} />
      </HeaderButton>
    ),
    right: isTouchDevice ? null : (
      <DropdownMenu
        trigger={
          <HeaderButton>
            <Bars3Icon width={24} height={24} />
          </HeaderButton>
        }
        options={[
          {
            label: "새 창으로 열기",
            onSelect: () =>
              window.open(
                window.location.href,
                "_blank",
                "popup=true, scrollbars=0, location=0"
              ),
          },
        ]}
      />
    ),
  };

  useHeader(headerConfig);

  return (
    <>
      <UserCard user={userInfo} />
      <h1 className={s.title}>
        playground
        <br />
        for
        <br />
        friends
      </h1>
      {userInfo.role === "ADMIN" && (
        <DropdownMenu
          trigger={
            <Button className={s.adminBtn} variant="black" inline>
              ADMIN
            </Button>
          }
          options={[
            { label: "Members", onSelect: adminMembersHandler },
            { label: "Rooms", onSelect: adminRoomsHandler },
          ]}
        />
      )}

      <Button variant="primary" onClick={lobbyHandler} inline>
        Join Rooms
      </Button>
      <Button variant="black" onClick={profileHandler} inline>
        My Profile
      </Button>
    </>
  );
};
