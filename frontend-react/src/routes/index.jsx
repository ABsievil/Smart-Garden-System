import { Navigate } from 'react-router-dom';
import Layout1 from '../Components/Layouts/Layout1/Layout1';
import Layout2 from "../Components/Layouts/Layout2/Layout2";
import Dashboard from "../Pages/Admin/Dashboard/Dashboard";
import DeviceManager from "../Pages/Admin/DeviceManager/DeviceManager";
import Scheduler from "../Pages/Admin/Scheduler/Scheduler";
import StaffManager from "../Pages/Admin/StaffManager/StaffManager";
import TreeManager from "../Pages/Admin/TreeManager/TreeManager";
import ForgetPassword from "../Pages/Login/ForgetPassword/ForgetPassword";
import SignIn from "../Pages/Login/Signin/Login";
import ControlDevice from "../Pages/Staff/ControlDevice/ControlDevice";
import ViewScheduler from "../Pages/Staff/SchedulerViewing/SchedulerViewing";
import TreeView from "../Pages/Staff/TreeViewing/TreeViewing";
const userData = localStorage.getItem("userData");
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
          element: (
            <ForgetPassword  />
          ),
        },
      ],
    },
    {
      path: "/",
      element: <Layout2 />,
      children: [
        {
          path: "/dash-board",
          element: <Dashboard />,
        },
        {
          path: "/device-manager",
          element: <DeviceManager/>,
        },
        {
            path: "/control-device",
            element: <ControlDevice/>,
        },
        {
            path: "/tree-manager",
            element: <TreeManager/>,
        },
        {
            path: "/staff-manager",
            element: <StaffManager/>,
        },
        {
            path: "/scheduler",
            element: <Scheduler/>,
        },
        {
            path: "/tree-view",
            element: <TreeView/>,
        },
        {
            path: "/scheduler-view",
            element: <ViewScheduler/>,
        },
    ],
    },

];
