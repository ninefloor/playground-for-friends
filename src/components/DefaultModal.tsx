import { HTMLAttributes } from "react";
import s from "./DefaultModal.module.scss";

interface DefaultModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  close: () => void;
  backdrop?: boolean;
}

export const DefaultModal = ({
  isOpen,
  close,
  backdrop,
  children,
  ...props
}: DefaultModalProps) => {
  return (
    isOpen && (
      <div
        aria-modal
        className={s.backdrop}
        onClick={backdrop ? undefined : close}
        {...props}
      >
        <div className={s.window} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    )
  );
};
