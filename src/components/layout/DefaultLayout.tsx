import { Header } from "@components/layout/Header";
import { Loading } from "@components/Loading";
import { authReadyAtom } from "@utils/authReadyAtom";
import { auth, firestore } from "@utils/firebase";
import { userInfoAtom } from "@utils/userInfoAtom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAtomValue, useSetAtom } from "jotai/react";
import { useEffect, useMemo, useState } from "react";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import s from "./DefaultLayout.module.scss";

const ignoreHeaderPatterns = ["/room/:roomId/admin"];

const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  left: null,
  right: null,
  title: null,
  hideBack: false,
};

export const DefaultLayout = () => {
  const setUserInfo = useSetAtom(userInfoAtom);
  const setAuthReady = useSetAtom(authReadyAtom);
  const ready = useAtomValue(authReadyAtom);

  const location = useLocation();
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(
    DEFAULT_HEADER_CONFIG
  );

  const shouldShowHeader = !ignoreHeaderPatterns.some((pattern) =>
    matchPath(pattern, location.pathname)
  );

  const headerCtx = useMemo<HeaderCtx>(
    () => ({
      setHeader: (cfg) => {
        setHeaderConfig((prev) => ({
          left: cfg.left ?? prev.left ?? null,
          right: cfg.right ?? prev.right ?? null,
          title: cfg.title ?? prev.title ?? null,
          hideBack: cfg.hideBack ?? prev.hideBack ?? false,
        }));
      },
      resetHeader: () => setHeaderConfig(DEFAULT_HEADER_CONFIG),
    }),
    []
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
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
      } else {
        setUserInfo(null);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [setUserInfo, setAuthReady]);

  return (
    <>
      {shouldShowHeader && <Header config={headerConfig} />}
      <div className={s.container}>
        {ready ? <Outlet context={headerCtx} /> : <Loading />}
      </div>
    </>
  );
};
