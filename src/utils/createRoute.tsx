import { Admin } from "@pages/Admin";
import { DecisionByUser } from "@pages/DecisionByUser";
import { Home } from "@pages/Home";
import { NotFound } from "@pages/NotFound";
import { RouteObject } from "react-router-dom";

export const createRoutes = (isAdmin: boolean, isAuthenticated: boolean) => {
  const defaultRoute: RouteObject = {
    path: "/",
    element: <Home />,
    children: [],
    errorElement: <NotFound />,
  };

  const authRoutes = [
    {
      path: "vote",
      element: <DecisionByUser />,
    },
    {
      path: "tier",
      element: <DecisionByUser />,
    },
  ];

  const adminRoutes = {
    path: "admin",
    element: <Admin />,
  };

  if (isAuthenticated)
    defaultRoute.children = [...authRoutes, isAdmin ? adminRoutes : {}];

  return [defaultRoute];
};
