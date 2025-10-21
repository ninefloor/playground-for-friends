import logoImage from "@assets/images/pff.svg";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import s from "./Header.module.scss";

export const Header = ({ hideBack = true }: { hideBack?: boolean }) => {
  const navigate = useNavigate();
  return (
    <header className={s.header}>
      {hideBack && (
        <button className={s.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon width={32} height={32} />
        </button>
      )}
      <img src={logoImage} alt="logo" className={s.logo} />
      {/* 오른쪽 균형용 빈 슬롯 (알림/프로필 버튼 자리) */}
      <div className={s.right} aria-hidden />
    </header>
  );
};
