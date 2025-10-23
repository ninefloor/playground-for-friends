import { type ComponentProps, type FC } from "react";
import s from "./DefaultModal.module.scss";

interface DefaultModalProps extends ComponentProps<"div"> {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  overlayId?: string;
}

export const DefaultModal: FC<DefaultModalProps> = ({
  isOpen,
  close,
  children,
}) => {
  // useEffect(() => {
  //   return () => unmount();
  // }, [unmount]);

  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal onClick={close} className={s.overlay}>
      <div onClick={(e) => e.stopPropagation()} className={s.content}>
        {children}
      </div>
    </div>
  );
};
