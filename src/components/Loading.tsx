import loading from "@assets/images/loading.svg";
import s from "./Loading.module.scss";

export const LayoutLoading = ({
  backgroundColor = "light",
}: {
  backgroundColor?: "light" | "dark";
}) => {
  return (
    <div
      className={`${s.container} ${backgroundColor ? s[backgroundColor] : ""}`}
    >
      <img src={loading} alt="loading" />
    </div>
  );
};
