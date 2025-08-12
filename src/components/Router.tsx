import { DefaultLayout } from "@components/layout/DefaultLayout";
import { AdminLayout, AuthLayout } from "@components/RouteGuards";
import { Admin } from "@pages/Admin";
import { DecisionByAdmin } from "@pages/DecisionByAdmin";
import { DecisionByUser } from "@pages/DecisionByUser";
import { Home } from "@pages/Home";
import { NotFound } from "@pages/NotFound";
import { Register } from "@pages/Register";
import { ProfileEdit } from "@pages/ProfileEdit";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/profile", element: <AuthLayout />, children: [{ path: "", element: <ProfileEdit /> }] },
      {
        element: <AuthLayout />, // 로그인 필요 섹션
        children: [
          { path: "/vote", element: <DecisionByUser /> },
          { path: "/tier", element: <DecisionByUser /> },
          {
            element: <AdminLayout />, // ADMIN 전용 섹션
            children: [
              { path: "/admin", element: <Admin /> },
              { path: "/admin/vote", element: <DecisionByAdmin /> },
              { path: "/admin/tier", element: <DecisionByAdmin /> },
              { path: "/admin/members", element: <DecisionByUser /> },
            ],
          },
        ],
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
