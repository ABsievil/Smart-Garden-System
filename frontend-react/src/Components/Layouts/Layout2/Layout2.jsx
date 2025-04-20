import { Outlet } from "react-router-dom";
import Sidebar from "../../SideBar/SideBar";
import "./Layout2.css";
function Layout2() {
  return (
    <>
    <div className="layout-app-container">
      <div className="sidebar-component">
        <Sidebar />
      </div>
      <main className="content-container">
       
        <div className="content-double">
          <div className="component-change">
        
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  </>
  );
}

export default Layout2;