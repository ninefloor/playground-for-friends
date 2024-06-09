import { FC, HTMLAttributes } from "react";
import s from "./Buttons.module.scss";

export const Button: FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={`${s.button} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const BlackBtn: FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={`${s.button} ${s.blackBtn} ${className}`} {...props}>
      {children}
    </button>
  );
};
