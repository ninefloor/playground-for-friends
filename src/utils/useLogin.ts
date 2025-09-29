import { auth, firestore } from "@utils/firebase";
import { userInfoAtom } from "@utils/userInfoAtom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useSetAtom } from "jotai";
import { type ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useLogin: 로그인 로직을 위한 훅
 * @type {Function}
 * @param {string} location - 로그인 후 경로 이동이 필요하다면 작성.
 * @return {object} email, emailHandler, pw, pwHander, isLoading, loginHander
 */

const useLogin = (location?: string) => {
  const [email, setEmail] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const setUserInfo = useSetAtom(userInfoAtom);

  const emailHandler = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setEmail(value);
  };

  const pwHander = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setPw(value);
  };

  const loginHander = async () => {
    try {
      setIsLoading(true);
      const data = await signInWithEmailAndPassword(auth, email, pw);
      const userId = data.user.uid;
      const docRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(docRef);
      const userData = userDoc.data();
      if (userData)
        setUserInfo({
          uid: userId,
          nickname: userData.nickname,
          photoURL: userData.photoURL,
          createdAt: userData.createdAt,
          role: userData.role,
          color: userData.color,
        });

      if (location) navigate(location);
    } catch (error) {
      console.error(error);
      alert("아이디나 비밀번호가 잘못되었습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return { email, emailHandler, pw, pwHander, isLoading, loginHander };
};

export default useLogin;
