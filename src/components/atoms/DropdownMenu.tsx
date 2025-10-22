import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenu as RdxDropdownMenu,
} from "@radix-ui/react-dropdown-menu";
import type { FC, ReactNode } from "react";
import s from "./DropdownMenu.module.scss";

export type DropdownOption = {
  key?: string;
  label: string;
  onSelect: () => void;
  danger?: boolean;
  disabled?: boolean;
};

type Props = {
  trigger: ReactNode;
  options: DropdownOption[];
  contentAlign?: "start" | "center" | "end";
  sideOffset?: number;
  contentClassName?: string;
  itemClassName?: string;
};

export const DropdownMenu: FC<Props> = ({
  trigger,
  options,
  contentAlign = "end",
  sideOffset = 4,
  contentClassName = "",
  itemClassName = "",
}) => {
  return (
    <RdxDropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align={contentAlign}
          sideOffset={sideOffset}
          className={`${s.content} ${contentClassName}`}
        >
          {options.map((opt, idx) => (
            <DropdownMenuItem
              key={opt.key ?? String(idx)}
              onSelect={() => {
                if (opt.disabled) return;
                opt.onSelect();
              }}
              disabled={opt.disabled}
              className={`${s.item} ${opt.danger ? s.danger : ""} ${
                opt.disabled ? s.disabled : ""
              } ${itemClassName}`}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </RdxDropdownMenu>
  );
};
