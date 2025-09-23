import { VoteBoard } from "@components/decisionByAdmin/VoteBoard";
import { VoteDecision } from "@components/decisionByUser/VoteDecision";
import { DefaultLayout } from "@components/layout/DefaultLayout";
import { AdminLayout, AuthLayout } from "@components/RouteGuards";
import { Admin } from "@pages/Admin";
import { AdminMemberEdit } from "@pages/AdminMemberEdit";
import { AdminMembers } from "@pages/AdminMembers";
import { AdminRooms } from "@pages/AdminRooms";
import { DecisionByAdmin } from "@pages/DecisionByAdmin";
import { Home } from "@pages/Home";
import { Lobby } from "@pages/Lobby";
import { NotFound } from "@pages/NotFound";
import { ProfileEdit } from "@pages/ProfileEdit";
import { Register } from "@pages/Register";
import { Room } from "@pages/Room";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      {
        path: "/profile",
        element: <AuthLayout />,
        children: [{ path: "", element: <ProfileEdit /> }],
      },
      {
        element: <AuthLayout />, // 로그인 필요 섹션
        children: [
          { path: "/lobby", element: <Lobby /> },
          { path: "/room/:roomId", element: <Room /> },
          { path: "/room/:roomId/vote", element: <VoteDecision /> },
          {
            element: <AdminLayout />, // ADMIN 전용 섹션
            children: [
              { path: "/admin", element: <Admin /> },
              { path: "/admin/rooms", element: <AdminRooms /> },
              { path: "/admin/vote", element: <DecisionByAdmin /> },
              { path: "/admin/tier", element: <DecisionByAdmin /> },
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
