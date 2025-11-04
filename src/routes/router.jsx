import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "../pages/ErrorPage";

import OrderSystemApp from "../pages/OrderSystemApp";
import OrderSystemDashboard from "../pages/OrderSystemDashboard";
import OrderSystemOptions from "../pages/OrderSystemOptions";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <OrderSystemApp /> },
      { path: "dashboard", element: <OrderSystemDashboard /> },
      { path: "options", element: <OrderSystemOptions /> },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);
