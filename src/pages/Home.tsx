import { DropdownMenu } from "@components/atoms/DropdownMenu";
import { AuthenticatedHome } from "@components/home/AuthenticatedHome";
import { UnauthenticatedHome } from "@components/home/UnauthenticatedHome";
import { HeaderButton } from "@components/layout/Header";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useHeader } from "@utils/useHeader";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useAtomValue } from "jotai";
import s from "./Home.module.scss";

export const Home = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const isTouchDevice = window?.matchMedia("(pointer: coarse)")?.matches;

  const headerConfig = {
    hideBack: true,
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
    <div className={s.container}>
      {userInfo ? (
        <AuthenticatedHome userInfo={userInfo} />
      ) : (
        <UnauthenticatedHome />
      )}
    </div>
  );
};
