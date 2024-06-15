import { DecisionByUser } from "@pages/DecisionByUser";
import { Home } from "@pages/Home";
import userInfo from "@utils/userInfo";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

export const Router = () => {
  const user = useRecoilValue(userInfo);
  const noAuthRouter = createBrowserRouter([
    {
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);
  const authRouter = createBrowserRouter([
    {
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
  return <RouterProvider router={user.userId ? authRouter : noAuthRouter} />;
};
