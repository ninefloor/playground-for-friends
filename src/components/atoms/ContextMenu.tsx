import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenu as ContextMenuRoot,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import s from "./ContextMenu.module.scss";

export interface MenuItem {
  key: string;
  label: string;
  onSelect: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export const ContextMenu = ({
  menus,
  className,
}: {
  menus: MenuItem[];
  className?: string;
}) => {
  return (
    <ContextMenuRoot>
      <ContextMenuTrigger className={className} />
      <ContextMenuPortal>
        <ContextMenuContent className={s.menu}>
          {menus.map((menu) => (
            <ContextMenuItem
              key={menu.key}
              onSelect={menu.onSelect}
              className={`${s.item} ${menu.danger ? s.danger : ""} ${
                menu.disabled ? s.disabled : ""
              }`}
            >
              {menu.label}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenuRoot>
  );
};
