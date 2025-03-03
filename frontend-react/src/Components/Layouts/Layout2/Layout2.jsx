import { Outlet } from "react-router-dom";
import "./Layout2.css";

function Layout2() {
  return (
    <>
      <div className="main-default-layout">
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout2;