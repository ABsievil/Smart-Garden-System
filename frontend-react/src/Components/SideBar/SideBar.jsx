import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DevicesIcon from '@mui/icons-material/Devices';
import ForestIcon from "@mui/icons-material/Forest";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import StorageIcon from "@mui/icons-material/Storage";
import { Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../redux/action";
import api from "./../../api";
import './SideBar.css';
const Sidebar = () => {
    const dispatch = useDispatch();
    const handleLogout = async () => {
    try{
        api.post('api/logout');
        dispatch(logout());
    }catch(e){
        console.error(e);
    }
    };
    const userRole = localStorage.getItem("role");
    return (
    <div className="sidebar">
        {/* Logo */}
        <Typography variant="h4" className="sidebar-title">
        SMART GARDEN
        </Typography>
        {/* Navigation */}
        {userRole && userRole === "USER"? 
        <ul>
        <li>
            <NavLink to="/control-device" className={({ isActive }) => isActive ? "active" : ""}>
            <StorageIcon style={{ marginRight: "10px", fontSize: "25px" , marginTop: "-4px" }}  /> Dữ liệu thiết bị
            </NavLink>
        </li>
        <li>
            <NavLink to="/tree-view" className={({ isActive }) => isActive ? "active" : ""}>
            <ForestIcon style={{ marginRight: "10px", fontSize: "25px" , marginTop: "-4px" }} /> Danh sách cây trồng
            </NavLink>
        </li>
        <li>
            <NavLink to="/scheduler-view" className={({ isActive }) => isActive ? "active" : ""}>
            <CalendarMonthIcon style={{ marginRight: "10px",fontSize: "25px" , marginTop: "-4px"}} /> Lịch trình
            </NavLink>
        </li>
        <div className="logout-button" onClick={handleLogout}>
        <NavLink to="/signin" className="logout-link">
            <LogoutIcon style={{ marginRight: "5px", fontSize: "25px"  }} /> Đăng xuất
        </NavLink>
        </div>
        </ul> : <ul>
        <li>
            <NavLink to="/dash-board" className={({ isActive }) => isActive ? "active" : ""}>
            <HomeIcon style={{ marginRight: "10px",fontSize: "25px" , marginTop: "-4px" }} /> Trang chủ
            </NavLink>
        </li>
        <li>
            <NavLink to="/tree-manager" className={({ isActive }) => isActive ? "active" : ""}>
            <ForestIcon style={{ marginRight: "10px",fontSize: "25px" , marginTop: "-4px" }} /> Quản lý cây trồng
            </NavLink>
        </li>
        <li>
            <NavLink to="/staff-manager" className={({ isActive }) => isActive ? "active" : ""}>
            <ManageAccountsIcon style={{ marginRight: "10px",fontSize: "25px" , marginTop: "-4px" }} /> Quản lý nhân viên
            </NavLink>
        </li>
        <li>
            <NavLink to="/scheduler" className={({ isActive }) => isActive ? "active" : ""}>
            <CalendarMonthIcon style={{ marginRight: "10px",fontSize: "25px" , marginTop: "-4px" }}  /> Lịch trình
            </NavLink>
        </li>
        <li>
            <NavLink to="/device-record" className={({ isActive }) => isActive ? "active" : ""}>
            <StorageIcon style={{marginRight: "10px",fontSize: "25px" , marginTop: "-4px" }}  /> Dữ liệu thiết bị
            </NavLink>
        </li>
        <li>
            <NavLink to="/device-manager" className={({ isActive }) => isActive ? "active" : ""}>
            <DevicesIcon style={{ marginRight: "10px",fontSize: "25px" , marginTop: "-4px" }}  /> Quản lý thiết bị
            </NavLink>
        </li>
        <div className="logout-button" onClick={handleLogout}>
        <NavLink to="/signin" className="logout-link">
            <LogoutIcon style={{ marginRight: "8px",fontSize: "25px"  }} /> Đăng xuất
        </NavLink>
        </div>
        </ul>
        }

    </div>
    );
};

export default Sidebar;