import { createRoutes } from "@utils/createRoute";
import userInfo from "@utils/userInfo";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

export const Router = () => {
  const { userId } = useRecoilValue(userInfo);
  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  const isAdmin = userId === adminId;
  const isAuthenticated = !!userId;

  const routes = createRoutes(isAdmin, isAuthenticated);

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};
