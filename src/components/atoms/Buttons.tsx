import type { ButtonHTMLAttributes, FC } from "react";
import s from "./Buttons.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "accent"
    | "danger"
    | "info"
    | "black";
  inline?: boolean;
};

export const Button: FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  inline = false,
  ...props
}) => {
  const isIncludeKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(
    children?.toString() ?? ""
  );
  return (
    <button
      className={`${s.button} ${s[variant]} ${inline ? s.inline : ""} ${
        isIncludeKorean ? s.korean : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const BlackBtn: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button className={`${s.button} ${s.blackBtn} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const CircleButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button className={`${s.circleBtn} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const DecisionButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button className={`${s.decisionBtn} ${className}`} {...props}>
      {children}
    </button>
  );
};
