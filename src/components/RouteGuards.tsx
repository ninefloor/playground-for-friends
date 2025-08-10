import { Loading } from "@components/Loading";
import { authReadyAtom } from "@utils/authReadyAtom";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useAtomValue } from "jotai";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AuthLayout = () => {
  const ready = useAtomValue(authReadyAtom);
  const user = useAtomValue(userInfoAtom);
  const location = useLocation();

  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  return <Outlet />;
};

export const AdminLayout = () => {
  const ready = useAtomValue(authReadyAtom);
  const user = useAtomValue(userInfoAtom);
  const location = useLocation();

  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return <Outlet />;
};
