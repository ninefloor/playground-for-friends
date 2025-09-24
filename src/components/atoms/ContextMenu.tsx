import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import s from "./ContextMenu.module.scss";

export interface MenuItem {
  key: string;
  label: string;
  onSelect: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface Position {
  x: number;
  y: number;
}

export const useContextMenu = () => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const itemsRef = useRef<MenuItem[]>([]);

  const close = useCallback(() => setOpen(false), []);

  const openAtEvent = useCallback((e: React.MouseEvent, items: MenuItem[]) => {
    e.preventDefault();
    itemsRef.current = items;
    const { clientX, clientY } = e;
    setPos({ x: clientX, y: clientY });
    setOpen(true);
  }, []);

  const Menu = useMemo(() => {
    const C = () => {
      const [mounted, setMounted] = useState(false);
      useEffect(() => setMounted(true), []);

      useEffect(() => {
        if (!open) return;
        const onKey = (ev: KeyboardEvent) => {
          if (ev.key === "Escape") close();
        };
        const onClick = () => close();
        window.addEventListener("keydown", onKey);
        window.addEventListener("click", onClick);
        return () => {
          window.removeEventListener("keydown", onKey);
          window.removeEventListener("click", onClick);
        };
      }, []);

      if (!open || !mounted) return null;

      // viewport 경계 보정
      const pad = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = 200; // 대략값
      const height = Math.max(40, itemsRef.current.length * 36 + 12);
      const left = Math.min(pos.x, vw - width - pad);
      const top = Math.min(pos.y, vh - height - pad);

      return createPortal(
        <div className={s.overlay}>
          <div
            className={s.menu}
            style={{ left, top }}
            onClick={(e) => e.stopPropagation()}
          >
            {itemsRef.current.map((it) => (
              <div
                key={it.key}
                className={`${s.item} ${it.danger ? s.danger : ""} ${
                  it.disabled ? s.disabled : ""
                }`}
                onClick={() => {
                  if (it.disabled) return;
                  try {
                    it.onSelect();
                  } finally {
                    close();
                  }
                }}
              >
                {it.label}
              </div>
            ))}
          </div>
        </div>,
        document.body
      );
    };
    return C;
  }, [open, pos, close]);

  return { openAtEvent, close, Menu } as const;
};
