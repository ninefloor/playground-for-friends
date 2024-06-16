import { Button } from "@components/atoms/Buttons";
import s from "./NotFound.module.scss";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={s.container}>
      <h2>Page Not Found!</h2>

      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </div>
  );
};
