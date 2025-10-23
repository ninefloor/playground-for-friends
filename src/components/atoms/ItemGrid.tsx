import type { ComponentProps, FC } from "react";
import s from "./ItemGrid.module.scss";

type GridProps = ComponentProps<"div">;

export const ItemGrid = ({ className = "", ...props }: GridProps) => {
  return <div className={`${s.grid} ${className}`} {...props} />;
};

type GridItemProps = ComponentProps<"div">;

const Item: FC<GridItemProps> = ({ className = "", ...props }) => {
  return <div className={`${s.item} ${className}`} {...props} />;
};

Item.displayName = "ItemGrid.Item";

ItemGrid.Item = Item;
