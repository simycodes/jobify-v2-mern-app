import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  Admin,
  EditJob,
  ViewJob,
  ConfirmDeleteJob
} from "./pages";

import { registerAction } from "./pages/Register";
import { loginAction } from "./pages/Login";
import { addJobAction } from "./pages/AddJob";
import { editJobAction } from "./pages/EditJob";
import { profileAction } from "./pages/Profile";
import { deleteJobAction } from "./pages/DeleteJob";
import { confirmDeleteJobAction } from "./pages/ConfirmDeleteJob";
import { DashboardLayoutLoader } from "./pages/DashboardLayout";
import { allJobsLoader } from "./pages/AllJobs";
import { editJobLoader } from "./pages/EditJob";
import { viewJobLoader } from "./pages/ViewJob";
import { confirmDeleteJobLoader } from "./pages/ConfirmDeleteJob";
import { adminLoader } from "./pages/Admin";
import { statsLoader } from "./pages/Stats";

// CHECKING THE APP THEME WHEN WEB APP IS FIRST ACCESSED
export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
  // Second argument (boolean) ensures class is only added or removed when the boolean is true
  // same as: isDarkTheme? document.body.add("dark-theme"): document.body.remove("dark-theme");
};
checkDefaultTheme(); // Change to dark-theme if it is enabled on app initial load

// WEB APP ROUTING
let router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />, // parent component to hold hold features of all component pages/app
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />, // will be displayed as home page with parent
      },
      {
        path: "/register",
        element: <Register />,
        action: registerAction, // action helps send data to the server
      },
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        loader: DashboardLayoutLoader, // loader helps get data from the server
        children: [
          {
            index: true,
            element: <AddJob />,
            action: addJobAction,
          },
          {
            path: "stats", // gran-children element path do not have /, else errors
            element: <Stats />,
            loader: statsLoader
          },
          {
            path: "all-jobs",
            element: <AllJobs />,
            loader: allJobsLoader,
          },
          {
            path: "profile",
            element: <Profile />,
            action: profileAction,
          },
          {
            path: "admin",
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: "edit-job/:id",
            element: <EditJob />,
            loader: editJobLoader,
            action: editJobAction,
          },
          {
            path: "delete-job/:id",
            action: deleteJobAction,
          },
          {
            path: "view-job/:id",
            element: <ViewJob />,
            loader: viewJobLoader,
          },
          {
            path: "confirm-delete-job/:id",
            element: <ConfirmDeleteJob />,
            loader: confirmDeleteJobLoader,
            action: confirmDeleteJobAction,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
