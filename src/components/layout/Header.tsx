import logoImage from "@assets/images/pff.svg";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import type { ComponentProps } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Header.module.scss";

export const Header = ({ config }: { config: HeaderConfig }) => {
  const navigate = useNavigate();
  return (
    <header className={s.header}>
      {config.left ??
        (!config.hideBack ? (
          <button className={s.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeftIcon width={24} height={24} />
          </button>
        ) : (
          <div className={s.right} aria-hidden />
        ))}
      {config.title ? (
        <h2 className={s.title}>{config.title}</h2>
      ) : (
        <img src={logoImage} alt="logo" className={s.logo} />
      )}
      {config.right ?? <div className={s.right} aria-hidden />}
    </header>
  );
};

export const HeaderButton = ({ ...props }: ComponentProps<"button">) => {
  const isString = typeof props.children !== "string";
  return (
    <button className={`${s.button} ${isString ? s.notString : ""}`} {...props}>
      {props.children}
    </button>
  );
};
