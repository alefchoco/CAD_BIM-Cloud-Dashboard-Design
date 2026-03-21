import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import DashboardAdvanced from "./pages/DashboardAdvanced";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/dashboard",
    Component: DashboardAdvanced,
  },
]);