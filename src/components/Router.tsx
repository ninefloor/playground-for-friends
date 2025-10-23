import { VoteBoard } from "@components/decisionByAdmin/VoteBoard";
import { VoteDecision } from "@components/decisionByUser/VoteDecision";
import { DefaultLayout } from "@components/layout/DefaultLayout";
import { AdminLayout, AuthLayout } from "@components/RouteGuards";
import { AdminMemberEdit } from "@pages/AdminMemberEdit";
import { AdminMembers } from "@pages/AdminMembers";
import { AdminRooms } from "@pages/AdminRooms";
import { Home } from "@pages/Home";
import { Lobby } from "@pages/Lobby";
import { NotFound } from "@pages/NotFound";
import { ProfileEdit } from "@pages/ProfileEdit";
import { Register } from "@pages/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      {
        element: <AuthLayout />, // 로그인 필요 섹션
        children: [
          {
            path: "/profile",
            element: <ProfileEdit />,
          },
          { path: "/lobby", element: <Lobby /> },
          { path: "/room/:roomId/vote", element: <VoteDecision /> },
          {
            element: <AdminLayout />, // ADMIN 전용 섹션
            children: [
              { path: "/admin/rooms", element: <AdminRooms /> },
              { path: "/admin/members", element: <AdminMembers /> },
              { path: "/admin/members/:uid", element: <AdminMemberEdit /> },
              { path: "/room/:roomId/admin", element: <VoteBoard /> },
            ],
          },
        ],
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
