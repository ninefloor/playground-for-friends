import { DefaultModal } from "@components/DefaultModal";
import { memo, type ReactNode, useState } from "react";

interface ModalProps {
  children: ReactNode;
}

export const useModal = (initIsOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(initIsOpen);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const Modal = memo(({ children }: ModalProps) => (
    <DefaultModal isOpen={isOpen} close={close}>
      {children}
    </DefaultModal>
  ));

  return { isOpen, open, close, Modal };
};
