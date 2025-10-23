import type { ComponentProps } from "react";
import s from "./ItemList.module.scss";

type ItemListProps = ComponentProps<"div">;

export const ItemList = ({ className = "", ...props }: ItemListProps) => {
  return <div className={`${s.list} ${className}`} {...props} />;
};

type RowProps = ComponentProps<"div">;

const Row = ({ className = "", ...props }: RowProps) => {
  return <div className={`${s.row} ${className}`} {...props} />;
};

Row.displayName = "ItemList.Row";

ItemList.Row = Row;
