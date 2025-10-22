import { LayoutLoading } from "@components/Loading";
import { authReadyAtom } from "@utils/authReadyAtom";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useAtomValue } from "jotai";
import {
  Navigate,
  Outlet,
  useLocation,
  useOutletContext,
} from "react-router-dom";

export const AuthLayout = () => {
  const ready = useAtomValue(authReadyAtom);
  const user = useAtomValue(userInfoAtom);
  const location = useLocation();

  const headerCtx = useOutletContext<HeaderCtx>();

  if (!ready) return <LayoutLoading />;
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  return <Outlet context={headerCtx} />;
};

export const AdminLayout = () => {
  const ready = useAtomValue(authReadyAtom);
  const user = useAtomValue(userInfoAtom);
  const location = useLocation();
  const headerCtx = useOutletContext<HeaderCtx>();

  if (!ready) return <LayoutLoading />;
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return <Outlet context={headerCtx} />;
};
