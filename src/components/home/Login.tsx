import useLogin from "@utils/useLogin";
import { Loading } from "@components/Loading";
import s from "./Login.module.scss";
import { Button } from "@components/atoms/Buttons";
import { useModal } from "@utils/useModal";
import { DefaultModal } from "@components/DefaultModal";

export const Login = () => {
  const { email, emailHandler, pw, pwHander, isLoading, loginHander } =
    useLogin("/");
  const { isOpen, open, close } = useModal();

  return (
    <div className={s.container}>
      <Button onClick={open}>login</Button>

      <DefaultModal isOpen={isOpen} close={close}>
        {isLoading && <Loading />}
        <div className={s.formContainer}>
          <div>
            <h2 className={s.desc}>email</h2>
            <input
              className={s.input}
              value={email}
              type="email"
              onChange={emailHandler}
            />
          </div>

          <div>
            <h2 className={s.desc}>password</h2>
            <input
              className={s.input}
              type="password"
              value={pw}
              onKeyUp={({ key }) => {
                if (key === "Enter") loginHander();
              }}
              onChange={pwHander}
            />
          </div>
          <Button onClick={loginHander}>login</Button>
        </div>
      </DefaultModal>
    </div>
  );
};
