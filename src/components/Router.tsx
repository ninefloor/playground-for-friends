import { DefaultLayout } from "@components/layout/DefaultLayout";
import { Admin } from "@pages/Admin";
import { DecisionByAdmin } from "@pages/DecisionByAdmin";
import { DecisionByUser } from "@pages/DecisionByUser";
import { Home } from "@pages/Home";
import { NotFound } from "@pages/NotFound";
import { Register } from "@pages/Register";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useAtomValue } from "jotai";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const Router = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const noAuthRouter = createBrowserRouter([
    {
      Component: DefaultLayout,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
  ]);

  const adminRouter = createBrowserRouter([
    {
      Component: DefaultLayout,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/register",
          element: <Register />,
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
        {
          path: "/admin/vote",
          element: <DecisionByAdmin />,
        },
        {
          path: "/admin/tier",
          element: <DecisionByAdmin />,
        },
        {
          path: "/admin/members",
          element: <DecisionByUser />,
        },
      ],
    },
  ]);
  const authRouter = createBrowserRouter([
    {
      Component: DefaultLayout,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/register",
          element: <Register />,
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
        userInfo
          ? userInfo.role === "ADMIN"
            ? adminRouter
            : authRouter
          : noAuthRouter
      }
    />
  );
};
