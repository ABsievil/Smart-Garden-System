import { Outlet } from "react-router-dom";
import backgroundImage from "../../../assets/img/Logintheme.png";
import "./Layout1.css";
function Layout1() {
  return (
    <>
      <div className="main-default-layout"style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',  zIndex: '-10'
    }}>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout1;