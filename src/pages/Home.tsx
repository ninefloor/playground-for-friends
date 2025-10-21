import { AuthenticatedHome } from "@components/home/AuthenticatedHome";
import { UnauthenticatedHome } from "@components/home/UnauthenticatedHome";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useAtomValue } from "jotai";
import s from "./Home.module.scss";

export const Home = () => {
  const userInfo = useAtomValue(userInfoAtom);

  return (
    <div className={s.container}>
      {userInfo ? <AuthenticatedHome /> : <UnauthenticatedHome />}
    </div>
  );
};
