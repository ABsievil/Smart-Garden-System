import { Navigate } from 'react-router-dom';
import Layout1 from '../Components/Layouts/Layout1/Layout1';
import Layout2 from "../Components/Layouts/Layout2/Layout2";
import Dashboard from "../Pages/Admin/Dashboard/Dashboard";
import DeviceManager from "../Pages/Admin/DeviceManager/DeviceManager";
import DeviceRecord from "../Pages/Admin/DeviceRecord/DeviceRecord";
import Scheduler from "../Pages/Admin/Scheduler/Scheduler";
import StaffManager from "../Pages/Admin/StaffManager/StaffManager";
import TreeManager from "../Pages/Admin/TreeManager/TreeManager";
import UserProfile from "../Pages/Admin/UserProfile/UserProfile";
import ForgetPassword from "../Pages/Login/ForgetPassword/ForgetPassword";
import SignIn from "../Pages/Login/Signin/Login";
import ControlDevice from "../Pages/Staff/ControlDevice/ControlDevice";
import ViewScheduler from "../Pages/Staff/SchedulerViewing/SchedulerViewing";
import TreeView from "../Pages/Staff/TreeViewing/TreeViewing";

// ProtectedRoute component to check for userData and redirect if not present
const ProtectedRoute = ({ children }) => {
  const userData = localStorage.getItem("userData");
  return userData ? children : <Navigate to="/signin" replace />;
};

export const routes = [
  {
    path: "/",
    element: <Layout1 />,
    children: [
      {
        path: "/",
        element: <Navigate to="/signin" replace />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout2 />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "/dash-board",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "/device-manager",
        element: <ProtectedRoute><DeviceManager /></ProtectedRoute>,
      },
      {
        path: "/control-device",
        element: <ProtectedRoute><ControlDevice /></ProtectedRoute>,
      },
      {
        path: "/device-record",
        element: <ProtectedRoute><DeviceRecord /></ProtectedRoute>,
      },
      {
        path: "/tree-manager",
        element: <ProtectedRoute><TreeManager /></ProtectedRoute>,
      },
      {
        path: "/staff-manager",
        element: <ProtectedRoute><StaffManager /></ProtectedRoute>,
      },
      {
        path: "/scheduler",
        element: <ProtectedRoute><Scheduler /></ProtectedRoute>,
      },
      {
        path: "/tree-view",
        element: <ProtectedRoute><TreeView /></ProtectedRoute>,
      },
      {
        path: "/scheduler-view",
        element: <ProtectedRoute><ViewScheduler /></ProtectedRoute>,
      },
      {
        path: "/user-profile",
        element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
      },
    ],
  },
];