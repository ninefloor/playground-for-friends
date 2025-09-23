import { type FC, type ReactNode } from "react";

interface DefaultModalProps {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
}

export const DefaultModal: FC<DefaultModalProps> = ({
  isOpen,
  close,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <div
      role="dialog"
      aria-modal
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 8,
          minWidth: 320,
          maxWidth: 640,
        }}
      >
        {children}
      </div>
    </div>
  );
};
