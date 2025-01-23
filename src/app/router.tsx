import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import App from "../App";
import Arena from "../arena/Arena";
import ArenaHome from "../arena/components/ArenaHome";
import CreateSession from "../arena/CreateSession";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/arena",
        children: [
          {
            path: "/arena",
            element: <ArenaHome />,
          },
          {
            path: "/arena/create",
            element: <CreateSession />,
          },
          {
            path: "/arena/session/:id",
            element: <Arena />,
          },
        ],
      },
    ],
  },
]);

export default router;
