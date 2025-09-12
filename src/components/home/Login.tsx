import { Button } from "@components/atoms/Buttons";
import { Input } from "@components/atoms/Input";
import { Loading } from "@components/Loading";
import useLogin from "@utils/useLogin";
import { useNavigate } from "react-router-dom";
import s from "./Login.module.scss";

export const Login = () => {
  const { email, emailHandler, pw, pwHander, isLoading, loginHander } =
    useLogin("/");
  const navigate = useNavigate();

  return (
    <>
      <div className={s.formContainer}>
        <div>
          <Input
            value={email}
            type="email"
            label="이메일"
            onChange={emailHandler}
          />
        </div>

        <div>
          <Input
            type="password"
            label="비밀번호"
            value={pw}
            onKeyUp={({ key }) => {
              if (key === "Enter") loginHander();
            }}
            onChange={pwHander}
          />
        </div>
        <Button onClick={loginHander}>로그인</Button>
        <Button variant="secondary" onClick={() => navigate("/register")}>
          회원가입
        </Button>
      </div>
      {isLoading && <Loading />}
    </>
  );
};
