import { Button } from "@components/atoms/Buttons";
import { UserCard } from "@components/decisionByAdmin/vote/UserItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { auth } from "@utils/firebase";
import { userInfoAtom } from "@utils/userInfoAtom";
import { signOut } from "firebase/auth";
import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useNavigate } from "react-router-dom";
import s from "./AuthenticatedHome.module.scss";

const AdminDropdown = () => {
  const navigate = useNavigate();

  const adminMembersHandler = () => {
    navigate("/admin/members");
  };

  const adminRoomsHandler = () => {
    navigate("/admin/rooms");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={s.adminBtn} variant="black" inline>
          ADMIN
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className={s.dropdownContent}
      >
        <DropdownMenuItem
          className={s.dropdownItem}
          onSelect={adminMembersHandler}
        >
          Members
        </DropdownMenuItem>
        <DropdownMenuItem
          className={s.dropdownItem}
          onSelect={adminRoomsHandler}
        >
          Rooms
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AuthenticatedHome = () => {
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

  const profileHandler = () => {
    navigate("/profile");
  };

  const lobbyHandler = () => {
    navigate("/lobby");
  };

  if (!userInfo) return null;

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
      {userInfo.role === "ADMIN" && <AdminDropdown />}
      <Button
        className={s.logoutBtn}
        variant="black"
        onClick={logoutHandler}
        inline
      >
        Logout
      </Button>
      <Button variant="primary" onClick={lobbyHandler} inline>
        Join Rooms
      </Button>
      <Button variant="black" onClick={profileHandler} inline>
        My Profile
      </Button>
      <Button className={s.pcBtn} variant="black" onClick={pcUserHander} inline>
        PC Ver.
      </Button>
    </>
  );
};
