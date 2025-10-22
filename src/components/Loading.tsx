import loading from "@assets/images/loading.svg";
import s from "./Loading.module.scss";

export const LayoutLoading = () => {
  return (
    <div className={s.container}>
      <img src={loading} alt="loading" />
    </div>
  );
};
