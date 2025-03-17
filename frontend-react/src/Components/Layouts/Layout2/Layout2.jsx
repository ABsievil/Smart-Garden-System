import { Outlet } from "react-router-dom";
import "./Layout2.css";
import Sidebar from "../../SideBar/SideBar";
function Layout2() {
  return (
    <>
      <div className="main-default-layout">
        <main>
          <Sidebar />
        </main>
      </div>
    </>
  );
}

export default Layout2;