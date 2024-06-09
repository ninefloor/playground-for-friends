import { MutatingDots } from "react-loader-spinner";
import s from "./Loading.module.scss";

export const Loading = () => {
  return (
    <div className={s.container}>
      <MutatingDots
        height="100"
        width="100"
        color="#ffffff"
        secondaryColor="#ffffff"
        radius="20"
        ariaLabel="mutating-dots-loading"
        visible={true}
      />
    </div>
  );
};
