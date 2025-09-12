import { Loading } from "@components/Loading";
import { authReadyAtom } from "@utils/authReadyAtom";
import { auth, firestore } from "@utils/firebase";
import { userInfoAtom } from "@utils/userInfoAtom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAtomValue, useSetAtom } from "jotai/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import s from "./DefaultLayout.module.scss";

export const DefaultLayout = () => {
  const setUserInfo = useSetAtom(userInfoAtom);
  const setAuthReady = useSetAtom(authReadyAtom);
  const ready = useAtomValue(authReadyAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const docRef = doc(firestore, "users", userId);
        try {
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
        } finally {
          // 어떤 경우에도 인증 판별은 완료되었음을 알림
          setAuthReady(true);
        }
      } else {
        setUserInfo(null);
        setAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, [setUserInfo, setAuthReady]);

  return <div className={s.container}>{ready ? <Outlet /> : <Loading />}</div>;
};
