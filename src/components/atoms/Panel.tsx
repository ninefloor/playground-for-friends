import type { ComponentProps } from "react";
import s from "./Panel.module.scss";

type PanelProps = ComponentProps<"div"> & { muted?: boolean };

export const Panel = ({
  muted = false,
  className = "",
  ...props
}: PanelProps) => {
  return (
    <div
      className={`${s.panel} ${muted ? s.muted : ""} ${className}`}
      {...props}
    />
  );
};
