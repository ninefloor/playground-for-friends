import { Admin } from "@pages/Admin";
import { DecisionByUser } from "@pages/DecisionByUser";
import { Home } from "@pages/Home";
import { NotFound } from "@pages/NotFound";
import userInfo from "@utils/userInfo";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

export const Router = () => {
  const { userId } = useRecoilValue(userInfo);
  const adminId = import.meta.env.VITE_APP_ADMIN_ID;
  const noAuthRouter = createBrowserRouter([
    {
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);
  const adminRouter = createBrowserRouter([
    {
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/vote",
          element: <DecisionByUser />,
        },
        {
          path: "/tier",
          element: <DecisionByUser />,
        },
        {
          path: "/admin",
          element: <Admin />,
        },
      ],
    },
  ]);
  const authRouter = createBrowserRouter([
    {
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/vote",
          element: <DecisionByUser />,
        },
        {
          path: "/tier",
          element: <DecisionByUser />,
        },
      ],
    },
  ]);
  return (
    <RouterProvider
      router={
        userId ? (userId === adminId ? adminRouter : authRouter) : noAuthRouter
      }
    />
  );
};
